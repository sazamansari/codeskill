import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import * as os from 'os';
import { ExecutionService, Status } from './execution.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Submission,
  SubmissionDocument,
  SubmissionStatus,
} from '../database/schemas/submission.schema';
import {
  ProblemMetadata,
  ProblemMetadataDocument,
} from '../database/schemas/problem-metadata.schema';
import {
  ProblemTestCase,
  ProblemTestCaseDocument,
} from '../database/schemas/problem-testcase.schema';
import { User, UserDocument } from '../database/schemas/user.schema';
import { AppGateway } from '../gateway/app.gateway';
import { RedisService } from '../redis/redis.service';

const WORKER_CONCURRENCY = Number(process.env.WORKER_CONCURRENCY) || 10;

@Processor('submissions', { concurrency: WORKER_CONCURRENCY })
export class JudgeProcessor extends WorkerHost {
  private readonly logger = new Logger(JudgeProcessor.name);
  private readonly runnerId = process.env.RUNNER_ID || `runner-${os.hostname()}-${process.pid}`;

  constructor(
    private readonly executionService: ExecutionService,
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    @InjectModel(ProblemMetadata.name)
    private problemModel: Model<ProblemMetadataDocument>,
    @InjectModel(ProblemTestCase.name)
    private testCaseModel: Model<ProblemTestCaseDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly appGateway: AppGateway,
    private readonly redisService: RedisService,
  ) {
    super();
    this.logger.log(
      `JudgeProcessor initialized on runner: ${this.runnerId} (concurrency: ${WORKER_CONCURRENCY})`,
    );
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(
      `[Judge:${this.runnerId}] Processing job ${job.id} — type: ${job.name}`,
    );

    if (job.name === 'run-code') {
      const { code, language, testCases, config = {}, userId } = job.data;
      if (userId) {
        this.appGateway.emitToUser(userId, 'run_status', {
          jobId: job.id,
          status: 'running',
          message: `Running code in isolated container sandbox...`,
        });
      }

      const results = await this.executionService.executeCode(
        language,
        code,
        testCases,
        config,
      );
      const passedCount = results.filter((result) => result.passed).length;
      const status = this.overallStatus(results);

      const payload = {
        success: true,
        status,
        results,
        runtime: results.reduce(
          (total, result) => total + (result.executionTime || 0),
          0,
        ),
        passedCount,
        totalCount: results.length,
      };

      if (userId) {
        this.appGateway.emitToUser(userId, 'run_complete', {
          jobId: job.id,
          ...payload,
        });
      }

      return payload;
    }

    if (job.name === 'evaluate-code') {
      const { submissionId, problemId, code, language, userId } = job.data;

      try {
        // 1. Mark as running in DB
        await this.submissionModel.findByIdAndUpdate(submissionId, {
          status: SubmissionStatus.RUNNING,
          startedAt: new Date(),
          runnerId: this.runnerId,
        });

        this.appGateway.emitToUser(userId, 'submission_status', {
          submissionId,
          status: SubmissionStatus.RUNNING,
          message: `Worker picked up submission on ${this.runnerId}`,
        });

        // 2. Fetch actual test cases from DB
        const problem = await this.problemModel
          .findById(problemId)
          .populate('config')
          .populate('testCases')
          .lean();

        if (!problem) {
          throw new Error(`Problem not found: ${problemId}`);
        }

        let testCases: any[] = [];
        const populatedTestCases = problem.testCases as any;

        if (populatedTestCases?.cases && Array.isArray(populatedTestCases.cases)) {
          testCases = populatedTestCases.cases.map((tc: any, i: number) => ({
            id: i + 1,
            input: tc.input || '',
            expected: tc.output || '',
            isHidden: tc.isHidden === true,
          }));
        }

        if (testCases.length === 0) {
          const testCaseDoc = await this.testCaseModel
            .findOne({ metadataId: problemId })
            .lean();
          if (testCaseDoc?.cases && Array.isArray(testCaseDoc.cases)) {
            testCases = testCaseDoc.cases.map((tc: any, i: number) => ({
              id: i + 1,
              input: tc.input || '',
              expected: tc.output || '',
              isHidden: tc.isHidden === true,
            }));
          }
        }

        if (testCases.length === 0) {
          this.logger.warn(`[Judge] No test cases found for problem ${problemId}`);
          await this.submissionModel.findByIdAndUpdate(submissionId, {
            status: SubmissionStatus.SYSTEM_ERROR,
            compileOutput: 'No test cases configured for this problem',
            completedAt: new Date(),
          });
          this.appGateway.emitToUser(userId, 'execution_error', {
            submissionId,
            status: SubmissionStatus.SYSTEM_ERROR,
            error: 'No test cases configured for this problem',
          });
          return { status: SubmissionStatus.SYSTEM_ERROR };
        }

        // 3. Notify user of testing phase
        this.appGateway.emitToUser(userId, 'submission_status', {
          submissionId,
          status: SubmissionStatus.TESTING,
          message: `Executing your ${language} code against ${testCases.length} test case(s)...`,
          totalTestCases: testCases.length,
        });

        // 4. Build execution config
        const config: any = {};
        const problemConfig = problem.config as any;
        if (problemConfig) {
          if (problemConfig.timeLimit) config.timeLimit = problemConfig.timeLimit;
          if (problemConfig.memoryLimit) config.memoryLimit = problemConfig.memoryLimit;
          if (problemConfig.cpuLimit) config.cpuLimit = problemConfig.cpuLimit;
          if (problemConfig.executionMode) config.executionMode = problemConfig.executionMode;
          if (problemConfig.functionSignature) {
            config.functionSignature = problemConfig.functionSignature;
          }
          if (problemConfig.exactOutput === true) config.exactOutput = true;
        }

        // 5. Execute code in sandbox
        const start = Date.now();
        const results = await this.executionService.executeCode(
          language,
          code,
          testCases,
          config,
        );
        const runtime = Date.now() - start;

        // 6. Evaluate results
        let passedCount = 0;
        let hasCompileError = false;
        let hasRuntimeError = false;
        let hasTLE = false;
        let hasMemoryLimit = false;
        let compileOutput = '';

        for (const res of results) {
          if (res.passed) {
            passedCount++;
          }
          if (res.status === Status.COMPILATION_ERROR) {
            hasCompileError = true;
            compileOutput = res.error || '';
          }
          if (res.status === Status.RUNTIME_ERROR) hasRuntimeError = true;
          if (res.status === Status.TIME_LIMIT_EXCEEDED) hasTLE = true;
          if (res.status === Status.MEMORY_LIMIT_EXCEEDED) hasMemoryLimit = true;
        }

        const allPassed = passedCount === testCases.length;
        let status: string;
        if (allPassed) {
          status = SubmissionStatus.ACCEPTED;
        } else if (hasCompileError) {
          status = SubmissionStatus.COMPILATION_ERROR;
        } else if (hasMemoryLimit) {
          status = SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
        } else if (hasRuntimeError) {
          status = SubmissionStatus.RUNTIME_ERROR;
        } else if (hasTLE) {
          status = SubmissionStatus.TIME_LIMIT_EXCEEDED;
        } else {
          status = SubmissionStatus.WRONG_ANSWER;
        }

        // 7. Update DB with final results
        const updatedSubmission = await this.submissionModel.findByIdAndUpdate(
          submissionId,
          {
            status,
            runtime: `${runtime}ms`,
            executionTimeMs: runtime,
            memory: '0',
            testCasesPassed: passedCount,
            totalTestCases: testCases.length,
            compileOutput: compileOutput || undefined,
            completedAt: new Date(),
            testResults: results.map((result, index) =>
              testCases[index]?.isHidden
                ? {
                    id: result.id,
                    passed: result.passed,
                    status: result.status,
                    executionTime: result.executionTime,
                  }
                : result,
            ),
          },
          { new: true },
        );

        if (updatedSubmission && status === SubmissionStatus.ACCEPTED) {
          await this.userModel.updateOne(
            { _id: userId },
            { $inc: { 'stats.acceptedSubmissions': 1 } },
          );
        }

        // 8. Notify user of completion
        const completionPayload = {
          submissionId,
          status,
          runtime,
          passedCount,
          totalCount: testCases.length,
          results: results.map((result, index) =>
            testCases[index]?.isHidden
              ? {
                  id: result.id,
                  passed: result.passed,
                  status: result.status,
                  executionTime: result.executionTime,
                }
              : result,
          ),
        };

        this.appGateway.emitToUser(userId, 'submission_completed', completionPayload);
        this.appGateway.emitToUser(userId, 'execution_complete', completionPayload);

        this.logger.log(
          `[Judge] Submission ${submissionId}: ${status} (${passedCount}/${testCases.length}) in ${runtime}ms`,
        );

        return { status, passedCount, totalCount: testCases.length };
      } catch (err: any) {
        this.logger.error(
          `[Judge] Error processing submission ${submissionId}: ${err.message}`,
          err.stack,
        );

        await this.submissionModel.findByIdAndUpdate(submissionId, {
          status: SubmissionStatus.SYSTEM_ERROR,
          compileOutput: `Internal error: ${err.message}`,
          completedAt: new Date(),
        });

        this.appGateway.emitToUser(userId, 'execution_error', {
          submissionId,
          status: SubmissionStatus.SYSTEM_ERROR,
          error: 'An internal error occurred during execution.',
        });

        throw err;
      } finally {
        // Decrement active count in Redis for user
        const client = this.redisService.getClient();
        if (client && userId) {
          try {
            await client.decr(`active:submissions:${userId}`);
          } catch (e) {
            // Ignore redis cleanup error
          }
        }
      }
    }
  }

  private overallStatus(results: Array<{ passed: boolean; status: string }>): string {
    if (results.every((result) => result.passed)) return Status.ACCEPTED;
    if (results.some((result) => result.status === Status.COMPILATION_ERROR)) {
      return Status.COMPILATION_ERROR;
    }
    if (results.some((result) => result.status === Status.MEMORY_LIMIT_EXCEEDED)) {
      return Status.MEMORY_LIMIT_EXCEEDED;
    }
    if (results.some((result) => result.status === Status.RUNTIME_ERROR)) {
      return Status.RUNTIME_ERROR;
    }
    if (results.some((result) => result.status === Status.TIME_LIMIT_EXCEEDED)) {
      return Status.TIME_LIMIT_EXCEEDED;
    }
    if (results.some((result) => result.status === Status.SYSTEM_ERROR)) {
      return Status.SYSTEM_ERROR;
    }
    return Status.WRONG_ANSWER;
  }
}

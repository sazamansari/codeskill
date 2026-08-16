import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ExecutionService, Status } from './execution.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Submission,
  SubmissionDocument,
} from '../database/schemas/submission.schema';
import {
  ProblemMetadata,
  ProblemMetadataDocument,
} from '../database/schemas/problem-metadata.schema';
import {
  ProblemTestCase,
  ProblemTestCaseDocument,
} from '../database/schemas/problem-testcase.schema';
import { AppGateway } from '../gateway/app.gateway';

@Processor('submissions')
export class JudgeProcessor extends WorkerHost {
  private readonly logger = new Logger(JudgeProcessor.name);

  constructor(
    private readonly executionService: ExecutionService,
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    @InjectModel(ProblemMetadata.name)
    private problemModel: Model<ProblemMetadataDocument>,
    @InjectModel(ProblemTestCase.name)
    private testCaseModel: Model<ProblemTestCaseDocument>,
    private readonly appGateway: AppGateway,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(
      `[Judge] Processing job ${job.id} — type: ${job.name}`,
    );

    if (job.name === 'evaluate-code') {
      const { submissionId, problemId, code, language, userId } = job.data;

      try {
        // 1. Fetch actual test cases from DB
        const problem = await this.problemModel
          .findById(problemId)
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
          }));
        }

        if (testCases.length === 0) {
          // Fallback: try fetching test cases directly
          const testCaseDoc = await this.testCaseModel
            .findOne({ metadataId: problemId })
            .lean();
          if (testCaseDoc?.cases && Array.isArray(testCaseDoc.cases)) {
            testCases = testCaseDoc.cases.map((tc: any, i: number) => ({
              id: i + 1,
              input: tc.input || '',
              expected: tc.output || '',
            }));
          }
        }

        if (testCases.length === 0) {
          this.logger.warn(`[Judge] No test cases found for problem ${problemId}`);
          await this.submissionModel.findByIdAndUpdate(submissionId, {
            status: Status.SYSTEM_ERROR,
            compileOutput: 'No test cases configured for this problem',
          });
          this.appGateway.emitToUser(userId, 'execution_error', {
            submissionId,
            status: Status.SYSTEM_ERROR,
            error: 'No test cases configured for this problem',
          });
          return { status: Status.SYSTEM_ERROR };
        }

        // 2. Notify user that execution has started
        this.appGateway.emitToUser(userId, 'execution_update', {
          submissionId,
          status: 'running',
          message: `Executing your ${language} code against ${testCases.length} test case(s)...`,
        });

        // 3. Build execution config from problem
        const config: any = {};
        const problemConfig = problem.config as any;
        if (problemConfig) {
          if (problemConfig.timeLimit) config.timeLimit = problemConfig.timeLimit;
          if (problemConfig.memoryLimit) config.memoryLimit = problemConfig.memoryLimit;
        }

        // 4. Execute code
        const start = Date.now();
        const results = await this.executionService.executeCode(
          language,
          code,
          testCases,
          config,
        );
        const runtime = Date.now() - start;

        // 5. Evaluate results
        let passedCount = 0;
        let hasCompileError = false;
        let hasRuntimeError = false;
        let hasTLE = false;
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
        }

        const allPassed = passedCount === testCases.length;
        let status: string;
        if (allPassed) {
          status = Status.ACCEPTED;
        } else if (hasCompileError) {
          status = Status.COMPILATION_ERROR;
        } else if (hasRuntimeError) {
          status = Status.RUNTIME_ERROR;
        } else if (hasTLE) {
          status = Status.TIME_LIMIT_EXCEEDED;
        } else {
          status = Status.WRONG_ANSWER;
        }

        // 6. Update DB
        await this.submissionModel.findByIdAndUpdate(
          submissionId,
          {
            status,
            runtime: `${runtime}ms`,
            memory: '0',
            testCasesPassed: passedCount,
            totalTestCases: testCases.length,
            compileOutput: compileOutput || undefined,
            testResults: results,
          },
          { new: true },
        );

        // 7. Notify user of completion
        this.appGateway.emitToUser(userId, 'execution_complete', {
          submissionId,
          status,
          runtime,
          passedCount,
          totalCount: testCases.length,
          results,
        });

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
          status: Status.SYSTEM_ERROR,
          compileOutput: `Internal error: ${err.message}`,
        });

        this.appGateway.emitToUser(userId, 'execution_error', {
          submissionId,
          status: Status.SYSTEM_ERROR,
          error: 'An internal error occurred during execution.',
        });

        throw err;
      }
    }
  }
}

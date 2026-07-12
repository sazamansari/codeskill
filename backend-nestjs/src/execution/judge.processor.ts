import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Submission,
  SubmissionDocument,
} from '../database/schemas/submission.schema';
import { AppGateway } from '../gateway/app.gateway';

@Processor('submissions')
export class JudgeProcessor extends WorkerHost {
  private readonly logger = new Logger(JudgeProcessor.name);

  constructor(
    private readonly executionService: ExecutionService,
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private readonly appGateway: AppGateway,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'evaluate-code') {
      const { submissionId, problemId, code, language, userId } = job.data;

      try {
        // Fetch test cases from DB (mocked here for now, or we can use problems service)
        // In a real app we'd fetch the actual test cases for the problem
        const testCases = [
          {
            id: 1,
            input: { nums: [2, 7, 11, 15], target: 9 },
            expected: [0, 1],
          },
          { id: 2, input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
          { id: 3, input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
        ];

        // 1. Notify user that execution has started
        this.appGateway.emitToUser(userId, 'execution_update', {
          submissionId,
          status: 'running',
          message: 'Executing your code...',
        });

        // 2. Execute code
        const start = Date.now();
        const results = await this.executionService.executeCode(
          language,
          code,
          testCases,
          {},
        );
        const runtime = Date.now() - start;

        // 3. Evaluate results
        let allPassed = true;
        let passedCount = 0;
        let hasError = false;

        for (const res of results) {
          if (res.passed) {
            passedCount++;
          } else {
            allPassed = false;
            if (res.error) hasError = true;
          }
        }

        const status = allPassed
          ? 'accepted'
          : hasError
            ? 'error'
            : 'wrong_answer';

        // 4. Update DB
        const submission = await this.submissionModel.findByIdAndUpdate(
          submissionId,
          {
            status,
            runtime,
            memory: 0,
            testCasesPassed: passedCount,
            totalTestCases: testCases.length,
            details: results,
          },
          { new: true },
        );

        // 5. Notify user of completion
        this.appGateway.emitToUser(userId, 'execution_complete', {
          submissionId,
          status,
          runtime,
          passedCount,
          totalCount: testCases.length,
          results,
        });

        return { status, passedCount, totalCount: testCases.length };
      } catch (err: any) {
        this.logger.error(
          `Error processing submission ${submissionId}: ${err.message}`,
          err.stack,
        );

        await this.submissionModel.findByIdAndUpdate(submissionId, {
          status: 'error',
          error: err.message,
        });

        this.appGateway.emitToUser(userId, 'execution_error', {
          submissionId,
          status: 'error',
          error: 'An internal error occurred during execution.',
        });

        throw err;
      }
    }
  }
}

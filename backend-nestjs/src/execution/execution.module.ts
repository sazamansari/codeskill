import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { JudgeProcessor } from './judge.processor';
import {
  Submission,
  SubmissionSchema,
} from '../database/schemas/submission.schema';
import {
  ProblemMetadata,
  ProblemMetadataSchema,
} from '../database/schemas/problem-metadata.schema';
import {
  ProblemTestCase,
  ProblemTestCaseSchema,
} from '../database/schemas/problem-testcase.schema';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
      { name: ProblemMetadata.name, schema: ProblemMetadataSchema },
      { name: ProblemTestCase.name, schema: ProblemTestCaseSchema },
    ]),
    GatewayModule,
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService, JudgeProcessor],
  exports: [ExecutionService],
})
export class ExecutionModule {}

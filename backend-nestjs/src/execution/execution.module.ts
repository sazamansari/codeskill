import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { AzureExecutionService } from './azure-execution.service';
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
import { User, UserSchema } from '../database/schemas/user.schema';
import { GatewayModule } from '../gateway/gateway.module';
import { RedisModule } from '../redis/redis.module';

const judgeProviders =
  process.env.PROCESS_ROLE === 'judge' ? [JudgeProcessor] : [];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
      { name: ProblemMetadata.name, schema: ProblemMetadataSchema },
      { name: ProblemTestCase.name, schema: ProblemTestCaseSchema },
      { name: User.name, schema: UserSchema },
    ]),
    BullModule.registerQueue({
      name: 'submissions',
    }),
    GatewayModule,
    RedisModule,
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService, AzureExecutionService, ...judgeProviders],
  exports: [ExecutionService, AzureExecutionService],
})
export class ExecutionModule {}

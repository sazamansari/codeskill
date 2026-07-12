import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { JudgeProcessor } from './judge.processor';
import {
  Submission,
  SubmissionSchema,
} from '../database/schemas/submission.schema';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    GatewayModule,
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService, JudgeProcessor],
  exports: [ExecutionService],
})
export class ExecutionModule {}

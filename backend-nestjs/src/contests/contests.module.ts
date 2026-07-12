import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContestsController } from './contests.controller';
import { ContestsService } from './contests.service';
import { Contest, ContestSchema } from '../database/schemas/contest.schema';
import {
  ContestAttempt,
  ContestAttemptSchema,
} from '../database/schemas/contest-attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contest.name, schema: ContestSchema },
      { name: ContestAttempt.name, schema: ContestAttemptSchema },
    ]),
  ],
  controllers: [ContestsController],
  providers: [ContestsService],
  exports: [ContestsService],
})
export class ContestsModule {}

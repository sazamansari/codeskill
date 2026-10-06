import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import {
  AssessmentAttempt,
  AssessmentAttemptSchema,
} from '../database/schemas/assessment-attempt.schema';
import {
  Assessment,
  AssessmentSchema,
} from '../database/schemas/assessment.schema';
import { Question, QuestionSchema } from '../database/schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssessmentAttempt.name, schema: AssessmentAttemptSchema },
      { name: Assessment.name, schema: AssessmentSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import {
  QuestionsController,
  QuestionBanksController,
} from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [QuestionsController, QuestionBanksController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}

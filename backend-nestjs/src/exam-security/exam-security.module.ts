import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSecurityService } from './exam-security.service';
import { ExamSecurityController } from './exam-security.controller';
import {
  Assessment,
  AssessmentSchema,
} from '../database/schemas/assessment.schema';
import {
  ExamSession,
  ExamSessionSchema,
} from '../database/schemas/exam-session.schema';
import {
  ExamSecurityEvent,
  ExamSecurityEventSchema,
} from '../database/schemas/exam-security-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
      { name: ExamSession.name, schema: ExamSessionSchema },
      { name: ExamSecurityEvent.name, schema: ExamSecurityEventSchema },
    ]),
  ],
  controllers: [ExamSecurityController],
  providers: [ExamSecurityService],
  exports: [ExamSecurityService],
})
export class ExamSecurityModule {}

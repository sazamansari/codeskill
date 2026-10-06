import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AssessmentsService } from './assessments.service';
import { AssessmentsAdminController } from './assessments-admin.controller';
import { AssessmentsStudentController } from './assessments-student.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AssessmentsAdminController, AssessmentsStudentController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}

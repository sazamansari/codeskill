import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserSchema } from './schemas/user.schema';
import { User as UserEntity } from './entities/user.entity';
import { Problem, ProblemSchema } from './schemas/problem.schema';
import { Problem as ProblemEntity } from './entities/problem.entity';
import { Question as QuestionEntity } from './entities/question.entity';
import { Assessment as AssessmentEntity } from './entities/assessment.entity';
import { Submission as SubmissionEntity } from './entities/submission.entity';
import {
  ProblemMetadata,
  ProblemMetadataSchema,
} from './schemas/problem-metadata.schema';
import {
  ProblemStatement,
  ProblemStatementSchema,
} from './schemas/problem-statement.schema';
import {
  ProblemConfig,
  ProblemConfigSchema,
} from './schemas/problem-config.schema';
import {
  ProblemTestCase,
  ProblemTestCaseSchema,
} from './schemas/problem-testcase.schema';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { Contest, ContestSchema } from './schemas/contest.schema';
import {
  ContestAttempt,
  ContestAttemptSchema,
} from './schemas/contest-attempt.schema';
import { Company, CompanySchema } from './schemas/company.schema';
import { CompanyUser, CompanyUserSchema } from './schemas/company-user.schema';
import { Job, JobSchema } from './schemas/job.schema';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { University, UniversitySchema } from './schemas/university.schema';
import {
  UniversityUser,
  UniversityUserSchema,
} from './schemas/university-user.schema';
import { Batch, BatchSchema } from './schemas/batch.schema';
import {
  StudentEnrollment,
  StudentEnrollmentSchema,
} from './schemas/student-enrollment.schema';
import { Discussion, DiscussionSchema } from './schemas/discussion.schema';
import {
  DiscussionReply,
  DiscussionReplySchema,
} from './schemas/discussion-reply.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { EmailJob, EmailJobSchema } from './schemas/email-job.schema';
import { Question, QuestionSchema } from './schemas/question.schema';
import {
  QuestionBank,
  QuestionBankSchema,
} from './schemas/question-bank.schema';
import { Assessment, AssessmentSchema } from './schemas/assessment.schema';
import {
  AssessmentAttempt,
  AssessmentAttemptSchema,
} from './schemas/assessment-attempt.schema';
import { ExamSession, ExamSessionSchema } from './schemas/exam-session.schema';
import {
  ExamSecurityEvent,
  ExamSecurityEventSchema,
} from './schemas/exam-security-event.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('database.postgres.url');
        if (url) {
          return {
            type: 'postgres',
            url,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production', // Use migrations in production
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('database.postgres.host'),
          port: configService.get<number>('database.postgres.port'),
          username: configService.get<string>('database.postgres.username'),
          password: configService.get<string>('database.postgres.password'),
          database: configService.get<string>('database.postgres.database'),
          ssl: configService.get<boolean>('database.postgres.ssl')
            ? { rejectUnauthorized: false }
            : false,
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV !== 'production', // Use migrations in production
        };
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Problem.name, schema: ProblemSchema },
      { name: ProblemMetadata.name, schema: ProblemMetadataSchema },
      { name: ProblemStatement.name, schema: ProblemStatementSchema },
      { name: ProblemConfig.name, schema: ProblemConfigSchema },
      { name: ProblemTestCase.name, schema: ProblemTestCaseSchema },
      { name: Submission.name, schema: SubmissionSchema },
      { name: Contest.name, schema: ContestSchema },
      { name: ContestAttempt.name, schema: ContestAttemptSchema },
      { name: Company.name, schema: CompanySchema },
      { name: CompanyUser.name, schema: CompanyUserSchema },
      { name: Job.name, schema: JobSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: University.name, schema: UniversitySchema },
      { name: UniversityUser.name, schema: UniversityUserSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: StudentEnrollment.name, schema: StudentEnrollmentSchema },
      { name: Discussion.name, schema: DiscussionSchema },
      { name: DiscussionReply.name, schema: DiscussionReplySchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: EmailJob.name, schema: EmailJobSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: QuestionBank.name, schema: QuestionBankSchema },
      { name: Assessment.name, schema: AssessmentSchema },
      { name: AssessmentAttempt.name, schema: AssessmentAttemptSchema },
      { name: ExamSession.name, schema: ExamSessionSchema },
      { name: ExamSecurityEvent.name, schema: ExamSecurityEventSchema },
    ]),
    TypeOrmModule.forFeature([
      UserEntity,
      ProblemEntity,
      QuestionEntity,
      AssessmentEntity,
      SubmissionEntity,
    ]),
  ],
  exports: [MongooseModule, TypeOrmModule],
})
export class DatabaseModule {}

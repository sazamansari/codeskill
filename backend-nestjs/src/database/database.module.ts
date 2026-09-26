import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserSchema } from './schemas/user.schema';
import { Problem, ProblemSchema } from './schemas/problem.schema';
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

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
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
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../database/schemas/user.schema';
import {
  ProblemMetadata,
  ProblemMetadataSchema,
} from '../database/schemas/problem-metadata.schema';
import {
  Submission,
  SubmissionSchema,
} from '../database/schemas/submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ProblemMetadata.name, schema: ProblemMetadataSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

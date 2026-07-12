import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import {
  ProblemMetadata,
  ProblemMetadataSchema,
} from '../database/schemas/problem-metadata.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProblemMetadata.name, schema: ProblemMetadataSchema },
    ]),
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService],
  exports: [ProblemsService],
})
export class ProblemsModule {}

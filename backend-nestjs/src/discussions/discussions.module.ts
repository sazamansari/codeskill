import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionsController } from './discussions.controller';
import { DiscussionsService } from './discussions.service';
import {
  Discussion,
  DiscussionSchema,
} from '../database/schemas/discussion.schema';
import {
  DiscussionReply,
  DiscussionReplySchema,
} from '../database/schemas/discussion-reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema },
      { name: DiscussionReply.name, schema: DiscussionReplySchema },
    ]),
  ],
  controllers: [DiscussionsController],
  providers: [DiscussionsService],
  exports: [DiscussionsService],
})
export class DiscussionsModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Discussion } from './discussion.schema';

export type DiscussionReplyDocument = HydratedDocument<DiscussionReply>;

@Schema({ timestamps: true })
export class DiscussionReply {
  @Prop({
    type: Types.ObjectId,
    ref: 'Discussion',
    required: true,
    index: true,
  })
  discussion: Discussion | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User | Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 3000 })
  body: string;

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  upvotedBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  downvotedBy: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'DiscussionReply', default: null })
  parentReply: DiscussionReply | Types.ObjectId | null;
}

export const DiscussionReplySchema =
  SchemaFactory.createForClass(DiscussionReply);

DiscussionReplySchema.index({ discussion: 1, createdAt: 1 });

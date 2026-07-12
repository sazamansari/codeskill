import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type DiscussionDocument = HydratedDocument<Discussion>;

@Schema({ timestamps: true })
export class Discussion {
  @Prop({ required: true, index: true })
  problemId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User | Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ required: true, trim: true, maxlength: 5000 })
  body: string;

  @Prop({
    type: [String],
    enum: ['approach', 'help', 'solution', 'optimization', 'general'],
    default: ['general'],
  })
  tags: string[];

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  upvotedBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  downvotedBy: Types.ObjectId[];

  @Prop({ default: 0 })
  replyCount: number;

  @Prop({ default: false })
  isPinned: boolean;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);

DiscussionSchema.index({ problemId: 1, createdAt: -1 });
DiscussionSchema.index({ problemId: 1, upvotes: -1 });

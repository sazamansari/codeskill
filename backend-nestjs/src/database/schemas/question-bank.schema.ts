import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionBankDocument = HydratedDocument<QuestionBank>;

@Schema({ timestamps: true })
export class QuestionBank {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '', trim: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }], default: [] })
  questions: Types.ObjectId[];

  @Prop({ required: true, index: true, trim: true })
  topic: string;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  createdBy: Types.ObjectId;
}

export const QuestionBankSchema = SchemaFactory.createForClass(QuestionBank);

QuestionBankSchema.index({ topic: 1, name: 1 });

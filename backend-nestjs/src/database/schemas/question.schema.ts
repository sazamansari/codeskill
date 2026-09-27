import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type QuestionDocument = HydratedDocument<Question>;

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionStatus = 'pending' | 'approved' | 'rejected' | 'archived';
export type QuestionType = 'single_choice' | 'multiple_choice' | 'coding' | 'algorithmic';

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true, trim: true })
  question: string;

  @Prop({ type: [String], required: true, default: [] })
  options: string[];

  // Zero-based index of correct option (or multiple indices for multiple choice)
  @Prop({ required: true })
  correctAnswer: number;

  @Prop({ default: '' })
  explanation: string;

  @Prop({ default: '' })
  codeSnippet?: string;

  @Prop({ required: true, index: true, trim: true })
  topic: string;

  @Prop({ default: '', index: true, trim: true })
  subtopic: string;

  @Prop({
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    index: true,
  })
  difficulty: QuestionDifficulty;

  @Prop({ default: 1 })
  marks: number;

  @Prop({ default: 0 })
  negativeMarks: number;

  @Prop({ default: 'general', trim: true })
  language: string;

  @Prop({
    type: String,
    enum: ['single_choice', 'multiple_choice', 'coding', 'algorithmic'],
    default: 'single_choice',
  })
  questionType: QuestionType;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected', 'archived'],
    default: 'approved',
    index: true,
  })
  status: QuestionStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  createdBy: Types.ObjectId;

  @Prop({ default: false, index: true })
  aiGenerated: boolean;

  @Prop({ default: '' })
  aiProvider?: string;

  @Prop({ default: '' })
  aiModel?: string;

  @Prop()
  generatedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;

  @Prop({ default: '' })
  rejectedReason?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// High-speed compound indexes for fast searching over 10,000+ questions in <500ms
QuestionSchema.index({ topic: 1, difficulty: 1, status: 1 });
QuestionSchema.index({ topic: 1, subtopic: 1 });
QuestionSchema.index({ status: 1, createdAt: -1 });
QuestionSchema.index({ aiGenerated: 1, status: 1 });
QuestionSchema.index(
  { question: 'text', topic: 'text', subtopic: 'text' },
  { default_language: 'english', language_override: 'none' },
);

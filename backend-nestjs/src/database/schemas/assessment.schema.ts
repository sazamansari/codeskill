import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Question } from './question.schema';

export type AssessmentDocument = HydratedDocument<Assessment>;

export type AssessmentType = 'mcq' | 'coding' | 'hybrid';
export type AssessmentStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'archived';

@Schema({ _id: false })
export class ProctoringSettings {
  @Prop({ default: true })
  enforceFullscreen: boolean;

  @Prop({ default: true })
  blockCopyPaste: boolean;

  @Prop({ default: true })
  detectTabSwitch: boolean;

  @Prop({ default: 3 })
  maxTabSwitches: number;

  @Prop({ default: true })
  autoSubmitOnViolation: boolean;
}

@Schema({ timestamps: true })
export class Assessment {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    type: String,
    enum: ['mcq', 'coding', 'hybrid'],
    default: 'mcq',
  })
  type: AssessmentType;

  @Prop({
    type: String,
    enum: ['exam', 'quiz', 'practice', 'recruitment'],
    default: 'exam',
  })
  category: string;

  @Prop({ required: true, default: 60 })
  durationMinutes: number;

  @Prop({ default: 0 })
  totalMarks: number;

  @Prop({ default: 0 })
  passingMarks: number;

  @Prop({ default: true })
  negativeMarking: boolean;

  @Prop([{ type: Types.ObjectId, ref: 'Question' }])
  questions: Types.ObjectId[];

  // University Target Cohorts
  @Prop({ type: [String], default: [] })
  targetBatches: string[]; // e.g. ['2022-2026']

  @Prop({ type: [String], default: [] })
  targetDepartments: string[]; // e.g. ['Computer Science']

  @Prop({ type: [String], default: [] })
  targetCourses: string[]; // e.g. ['B.Tech CSE']

  @Prop({ type: [String], default: [] })
  targetSections: string[]; // e.g. ['A1', 'B2']

  // Scheduling
  @Prop()
  startTime?: Date;

  @Prop()
  endTime?: Date;

  @Prop({ default: true })
  shuffleQuestions: boolean;

  @Prop({ default: true })
  shuffleOptions: boolean;

  @Prop({ default: true })
  showResultImmediately: boolean;

  @Prop({ default: true })
  allowReview: boolean;

  @Prop({ default: 1 })
  allowedAttempts: number;

  @Prop({ type: ProctoringSettings, default: () => ({}) })
  proctoring: ProctoringSettings;

  @Prop({
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'archived'],
    default: 'published',
    index: true,
  })
  status: AssessmentStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  instructions: string[];
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);

AssessmentSchema.index({ status: 1, startTime: 1, endTime: 1 });
AssessmentSchema.index({ targetBatches: 1 });
AssessmentSchema.index({ targetDepartments: 1 });
AssessmentSchema.index({ code: 1 }, { unique: true });

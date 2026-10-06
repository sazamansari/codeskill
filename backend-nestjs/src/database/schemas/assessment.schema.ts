import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Question } from './question.schema';

export type AssessmentDocument = HydratedDocument<Assessment>;

export type AssessmentType = 'mcq' | 'coding' | 'hybrid';
export type AssessmentStatus =
  'draft' | 'published' | 'ongoing' | 'completed' | 'archived';

@Schema({ _id: true })
export class AssessmentQuestionConfig {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  marks: number;

  @Prop({ default: 0 })
  negativeMarks: number;

  @Prop({ default: 0 })
  order: number;
}

@Schema({ _id: true })
export class AssessmentSection {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 0 })
  timeLimit: number; // in minutes, optional per section

  @Prop({ type: [AssessmentQuestionConfig], default: [] })
  questions: AssessmentQuestionConfig[];
}

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

@Schema({ _id: false })
export class SecurityPolicy {
  @Prop({
    type: String,
    enum: ['DISABLED', 'STANDARD', 'STRICT'],
    default: 'DISABLED',
  })
  secureExamMode: 'DISABLED' | 'STANDARD' | 'STRICT';

  @Prop({ default: false })
  requireSEB: boolean;

  @Prop({ type: [String], default: [] })
  allowedSEBVersions: string[];

  @Prop({ default: false })
  requireFullscreen: boolean;

  @Prop({ default: false })
  disableClipboard: boolean;

  @Prop({ default: false })
  disableNavigation: boolean;

  @Prop({ default: false })
  disablePrinting: boolean;

  @Prop({ default: false })
  allowDownloads: boolean;

  @Prop({ default: false })
  allowUploads: boolean;

  @Prop({ default: 30 }) // in seconds
  heartbeatInterval: number;

  @Prop({ default: 60 }) // in seconds
  heartbeatGracePeriod: number;

  @Prop({ default: 3 })
  violationThreshold: number;

  @Prop({
    type: String,
    enum: ['NONE', 'BASIC', 'STANDARD', 'STRICT'],
    default: 'NONE',
  })
  proctoringMode: 'NONE' | 'BASIC' | 'STANDARD' | 'STRICT';
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
    enum: ['mcq', 'coding', 'hybrid', 'technical'],
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
  questions: Types.ObjectId[]; // Kept for backwards compatibility

  @Prop({ type: [AssessmentSection], default: [] })
  sections: AssessmentSection[];

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

  @Prop({ type: SecurityPolicy, default: () => ({}) })
  securityPolicy: SecurityPolicy;

  @Prop({
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'archived'],
    default: 'published',
    index: true,
  })
  status: AssessmentStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  instructions: string[];
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);

AssessmentSchema.index({ status: 1, startTime: 1, endTime: 1 });
AssessmentSchema.index({ targetBatches: 1 });
AssessmentSchema.index({ targetDepartments: 1 });

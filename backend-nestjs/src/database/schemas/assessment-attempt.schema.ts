import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Assessment } from './assessment.schema';
import { User } from './user.schema';
import { Question } from './question.schema';

export type AssessmentAttemptDocument = HydratedDocument<AssessmentAttempt>;

export type AttemptStatus =
  | 'in_progress'
  | 'submitted'
  | 'auto_submitted'
  | 'timed_out'
  | 'disqualified';

@Schema({ _id: false })
export class QuestionResponse {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  // Zero-based index of option selected (-1 if unattempted)
  @Prop({ type: Number, default: -1 })
  selectedAnswer: number;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({ default: 0 })
  marksAwarded: number;

  @Prop({ default: 0 })
  timeSpentSeconds: number;

  @Prop({
    type: String,
    enum: ['answered', 'marked_for_review', 'skipped', 'unvisited'],
    default: 'unvisited',
  })
  status: string;
}

@Schema({ _id: false })
export class ProctoringViolation {
  @Prop({ required: true })
  type: string; // 'tab_switch' | 'fullscreen_exit' | 'copy_paste_attempt'

  @Prop({ default: () => new Date() })
  timestamp: Date;

  @Prop({ default: '' })
  details: string;
}

@Schema({ timestamps: true })
export class AssessmentAttempt {
  @Prop({ type: Types.ObjectId, ref: 'Assessment', required: true, index: true })
  assessmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, index: true })
  studentUid: string;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  studentEmail: string;

  @Prop({
    type: String,
    enum: ['in_progress', 'submitted', 'auto_submitted', 'timed_out', 'disqualified'],
    default: 'in_progress',
    index: true,
  })
  status: AttemptStatus;

  @Prop({ default: () => new Date() })
  startedAt: Date;

  @Prop()
  submittedAt?: Date;

  @Prop({ default: 0 })
  timeSpentSeconds: number;

  @Prop({ type: [QuestionResponse], default: [] })
  responses: QuestionResponse[];

  // Order of question IDs presented to this student (for shuffle persistence)
  @Prop([{ type: Types.ObjectId, ref: 'Question' }])
  questionOrder: Types.ObjectId[];

  // Computed Evaluation Scores
  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  maxScore: number;

  @Prop({ default: 0 })
  percentage: number;

  @Prop({ default: false })
  passed: boolean;

  @Prop({ default: 0 })
  totalAttempted: number;

  @Prop({ default: 0 })
  totalCorrect: number;

  @Prop({ default: 0 })
  totalWrong: number;

  @Prop({ default: 0 })
  totalSkipped: number;

  @Prop({ default: 0 })
  accuracy: number;

  // Proctoring Telemetry
  @Prop({ default: 0 })
  tabSwitchCount: number;

  @Prop({ default: 0 })
  fullscreenExitCount: number;

  @Prop({ type: [ProctoringViolation], default: [] })
  violations: ProctoringViolation[];

  @Prop({ default: '' })
  disqualifiedReason?: string;
}

export const AssessmentAttemptSchema = SchemaFactory.createForClass(AssessmentAttempt);

AssessmentAttemptSchema.index({ assessmentId: 1, studentId: 1 });
AssessmentAttemptSchema.index({ assessmentId: 1, score: -1 });
AssessmentAttemptSchema.index({ studentUid: 1, status: 1 });

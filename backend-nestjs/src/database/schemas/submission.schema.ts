import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type SubmissionDocument = HydratedDocument<Submission>;

export const SubmissionStatus = {
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPILING: 'compiling',
  TESTING: 'testing',
  ACCEPTED: 'accepted',
  WRONG_ANSWER: 'wrong_answer',
  COMPILATION_ERROR: 'compile_error',
  RUNTIME_ERROR: 'runtime_error',
  TIME_LIMIT_EXCEEDED: 'time_limit',
  MEMORY_LIMIT_EXCEEDED: 'memory_limit',
  SYSTEM_ERROR: 'system_error',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
} as const;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: User | Types.ObjectId;

  @Prop({ required: true, index: true })
  problemId: string;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  code: string;

  @Prop({
    required: true,
    enum: [
      'queued',
      'running',
      'compiling',
      'testing',
      'pending',
      'accepted',
      'wrong_answer',
      'runtime_error',
      'time_limit',
      'compile_error',
      'memory_limit',
      'system_error',
      'cancelled',
    ],
    default: 'queued',
    index: true,
  })
  status: string;

  @Prop()
  runtime?: string;

  @Prop()
  memory?: string;

  @Prop({ default: 0 })
  testCasesPassed: number;

  @Prop({ default: 0 })
  totalTestCases: number;

  @Prop({ enum: ['Programming', 'Database', 'Web'] })
  category?: string;

  @Prop({ enum: ['Easy', 'Medium', 'Hard'] })
  difficulty?: string;

  /** Compiler output for compilation errors */
  @Prop()
  compileOutput?: string;

  /** Per-test-case detailed results from the judge */
  @Prop({ type: [Object] })
  testResults?: Record<string, any>[];

  @Prop({ type: Date, default: Date.now })
  queuedAt?: Date;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop()
  runnerId?: string;

  @Prop()
  executionTimeMs?: number;

  @Prop()
  memoryUsedKb?: number;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);

SubmissionSchema.index({ user: 1, problemId: 1 });
SubmissionSchema.index({ user: 1, createdAt: -1 });
SubmissionSchema.index({ status: 1, createdAt: -1 });

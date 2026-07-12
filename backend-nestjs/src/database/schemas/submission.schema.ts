import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type SubmissionDocument = HydratedDocument<Submission>;

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
      'accepted',
      'wrong_answer',
      'runtime_error',
      'time_limit',
      'compile_error',
    ],
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
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);

SubmissionSchema.index({ user: 1, problemId: 1 });
SubmissionSchema.index({ user: 1, createdAt: -1 });

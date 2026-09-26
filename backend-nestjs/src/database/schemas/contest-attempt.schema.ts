import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Contest } from './contest.schema';
import { User } from './user.schema';
import { ProblemMetadata } from './problem-metadata.schema';

export type ContestAttemptDocument = HydratedDocument<ContestAttempt>;

class Violation {
  @Prop()
  type: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ type: Types.Map })
  metadata?: any;
}

class SavedCode {
  @Prop({ type: Types.ObjectId, ref: 'ProblemMetadata' })
  problemId: ProblemMetadata | Types.ObjectId;

  @Prop()
  code: string;

  @Prop()
  language: string;

  @Prop({ default: Date.now })
  lastSaved: Date;
}

@Schema({ timestamps: true })
export class ContestAttempt {
  @Prop({ type: Types.ObjectId, ref: 'Contest', required: true })
  contestId: Contest | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User | Types.ObjectId;

  @Prop({ required: true })
  sessionId: string;

  @Prop()
  deviceFingerprint?: string;

  @Prop({
    enum: ['InProgress', 'Submitted', 'AutoSubmitted', 'Disqualified'],
    default: 'InProgress',
  })
  status: string;

  @Prop({ default: Date.now })
  startedAt: Date;

  @Prop()
  submittedAt?: Date;

  @Prop({ default: 0 })
  warnings: number;

  @Prop([Violation])
  violations: Violation[];

  @Prop([SavedCode])
  savedCode: SavedCode[];
}

export const ContestAttemptSchema =
  SchemaFactory.createForClass(ContestAttempt);

ContestAttemptSchema.index({ contestId: 1, userId: 1 }, { unique: true });

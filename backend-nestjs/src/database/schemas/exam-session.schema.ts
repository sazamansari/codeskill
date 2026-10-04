import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ExamSessionDocument = HydratedDocument<ExamSession>;

@Schema({ timestamps: true })
export class ExamSession {
  @Prop({
    type: Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true,
  })
  assessmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  candidateId: Types.ObjectId;

  @Prop({
    type: String,
    enum: [
      'CREATED',
      'VERIFIED',
      'ACTIVE',
      'SUSPENDED',
      'SECURITY_VIOLATION',
      'SUBMITTED',
      'EXPIRED',
      'TERMINATED',
    ],
    default: 'CREATED',
    index: true,
  })
  status: string;

  @Prop({
    type: String,
    enum: ['DISABLED', 'STANDARD', 'STRICT'],
    default: 'DISABLED',
  })
  secureMode: string;

  @Prop({ type: String, required: true })
  clientType: string; // 'BROWSER', 'SEB'

  @Prop({ type: String })
  clientVersion?: string;

  @Prop({ type: String })
  configKey?: string;

  @Prop({ type: Boolean })
  browserExamKeyVerified?: boolean;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  lastHeartbeatAt?: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Date })
  submittedAt?: Date;

  @Prop({ default: 'CLEAN' })
  securityState: string;

  @Prop({ default: 0 })
  violationCount: number;
}

export const ExamSessionSchema = SchemaFactory.createForClass(ExamSession);
ExamSessionSchema.index({ assessmentId: 1, candidateId: 1 }, { unique: true });

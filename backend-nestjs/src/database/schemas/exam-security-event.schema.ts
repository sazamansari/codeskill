import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ExamSecurityEventDocument = HydratedDocument<ExamSecurityEvent>;

@Schema({ timestamps: true })
export class ExamSecurityEvent {
  @Prop({
    type: Types.ObjectId,
    ref: 'ExamSession',
    required: true,
    index: true,
  })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  candidateId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true,
  })
  assessmentId: Types.ObjectId;

  @Prop({ required: true })
  eventType: string; // 'TAB_HIDDEN', 'FULLSCREEN_EXIT', 'INVALID_CONFIG_KEY', etc.

  @Prop({
    type: String,
    enum: ['INFO', 'WARNING', 'HIGH', 'CRITICAL'],
    default: 'INFO',
  })
  severity: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const ExamSecurityEventSchema =
  SchemaFactory.createForClass(ExamSecurityEvent);
ExamSecurityEventSchema.index({ sessionId: 1, createdAt: -1 });

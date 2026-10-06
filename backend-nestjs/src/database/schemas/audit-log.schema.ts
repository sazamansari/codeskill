import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  actorId?: Types.ObjectId;

  @Prop({ default: '' })
  actorEmail: string;

  @Prop({ required: true, index: true })
  action: string;

  @Prop({ default: '' })
  target: string;

  @Prop({ default: '' })
  targetType: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, index: true })
  studentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false, index: true })
  attemptId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false, index: true })
  assessmentId?: Types.ObjectId;

  @Prop({ default: '' })
  event?: string;

  @Prop({ default: 0 })
  riskWeight?: number;

  @Prop({ default: '' })
  ipAddress: string;

  @Prop({ default: '' })
  userAgent: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: Date.now, index: true })
  timestamp: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ targetType: 1, target: 1 });
AuditLogSchema.index({ studentId: 1, timestamp: -1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EmailJobDocument = HydratedDocument<EmailJob>;

export type EmailJobStatus = 'pending' | 'queued' | 'sent' | 'failed' | 'retrying';

@Schema({ timestamps: true })
export class EmailJob {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, index: true, uppercase: true })
  uid: string;

  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  temporaryPassword?: string;

  @Prop({
    type: String,
    enum: ['pending', 'queued', 'sent', 'failed', 'retrying'],
    default: 'pending',
    index: true,
  })
  status: EmailJobStatus;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop()
  sentAt?: Date;

  @Prop({ default: '' })
  error?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export const EmailJobSchema = SchemaFactory.createForClass(EmailJob);

EmailJobSchema.index({ status: 1, createdAt: -1 });
EmailJobSchema.index({ studentId: 1, status: 1 });
EmailJobSchema.index({ uid: 1, status: 1 });

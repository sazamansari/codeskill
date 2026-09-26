import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Job } from './job.schema';
import { Company } from './company.schema';
import { User } from './user.schema';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  job: Job | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  company: Company | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({
    enum: [
      'Applied',
      'Assessment',
      'Interview',
      'Technical Round',
      'HR Round',
      'Offer',
      'Hired',
      'Rejected',
    ],
    default: 'Applied',
  })
  stage: string;

  @Prop({ default: '' })
  resumeUrl: string;

  @Prop({ default: '' })
  coverLetter: string;

  @Prop({ default: '' })
  notes: string;

  @Prop({ type: Number, default: null })
  assessmentScore: number | null;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.index({ job: 1, user: 1 }, { unique: true });

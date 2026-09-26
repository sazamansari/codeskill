import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Company } from './company.schema';
import { User } from './user.schema';

export type JobDocument = HydratedDocument<Job>;

class SalaryRange {
  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop({ default: 'USD' })
  currency: string;
}

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  company: Company | Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  skills: string[];

  @Prop({
    enum: [
      'Internship',
      'Entry Level',
      'Mid Level',
      'Senior Level',
      'Executive',
    ],
    default: 'Entry Level',
  })
  experienceLevel: string;

  @Prop({ type: SalaryRange, default: () => ({}) })
  salaryRange: SalaryRange;

  @Prop()
  location?: string;

  @Prop({
    enum: ['On-site', 'Hybrid', 'Remote'],
    default: 'Remote',
  })
  workplaceType: string;

  @Prop({
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
  })
  employmentType: string;

  @Prop({
    enum: ['Draft', 'Published', 'Closed'],
    default: 'Published',
  })
  status: string;

  @Prop()
  applicationDeadline?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);

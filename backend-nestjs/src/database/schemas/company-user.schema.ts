import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Company } from './company.schema';
import { User } from './user.schema';

export type CompanyUserDocument = HydratedDocument<CompanyUser>;

@Schema({ timestamps: true })
export class CompanyUser {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  company: Company | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({
    enum: ['Owner', 'Admin', 'Recruiter', 'Interviewer', 'HR'],
    default: 'Recruiter',
  })
  role: string;

  @Prop({ default: '' })
  designation: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CompanyUserSchema = SchemaFactory.createForClass(CompanyUser);

CompanyUserSchema.index({ company: 1, user: 1 }, { unique: true });

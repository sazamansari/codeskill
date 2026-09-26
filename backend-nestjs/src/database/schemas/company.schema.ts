import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type CompanyDocument = HydratedDocument<Company>;

class SocialLinks {
  @Prop({ default: '' })
  linkedin: string;

  @Prop({ default: '' })
  twitter: string;

  @Prop({ default: '' })
  github: string;
}

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain alphanumeric characters, underscores, and dashes',
    ],
  })
  username: string;

  @Prop({ default: '' })
  logo: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ default: '' })
  industry: string;

  @Prop({ default: '' })
  website: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  headquarters: string;

  @Prop({
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', ''],
    default: '',
  })
  companySize: string;

  @Prop()
  foundedYear?: number;

  @Prop({ match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'] })
  email?: string;

  @Prop()
  phone?: string;

  @Prop({ type: SocialLinks, default: () => ({}) })
  socialLinks: SocialLinks;

  @Prop([String])
  techStack: string[];

  @Prop([String])
  benefits: string[];

  @Prop({
    enum: ['Actively Hiring', 'Hiring Paused', 'Not Hiring'],
    default: 'Actively Hiring',
  })
  hiringStatus: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

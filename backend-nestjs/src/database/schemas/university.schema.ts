import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type UniversityDocument = HydratedDocument<University>;

@Schema({ timestamps: true })
export class University {
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

  @Prop({ required: true, trim: true, lowercase: true })
  domain: string;

  @Prop({ default: '' })
  logo: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ default: '' })
  location: string;

  @Prop({ default: '' })
  website: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    enum: ['Tier 1', 'Tier 2', 'Tier 3', 'Unranked', ''],
    default: '',
  })
  tier: string;

  @Prop()
  establishedYear?: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;
}

export const UniversitySchema = SchemaFactory.createForClass(University);

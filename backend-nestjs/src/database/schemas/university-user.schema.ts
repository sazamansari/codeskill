import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { University } from './university.schema';
import { User } from './user.schema';

export type UniversityUserDocument = HydratedDocument<UniversityUser>;

@Schema({ timestamps: true })
export class UniversityUser {
  @Prop({ type: Types.ObjectId, ref: 'University', required: true })
  university: University | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({
    enum: ['Admin', 'Professor', 'TPO'],
    default: 'Professor',
  })
  role: string;

  @Prop({ default: '' })
  department: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UniversityUserSchema =
  SchemaFactory.createForClass(UniversityUser);

UniversityUserSchema.index({ university: 1, user: 1 }, { unique: true });

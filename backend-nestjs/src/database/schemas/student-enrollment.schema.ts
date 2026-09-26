import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { University } from './university.schema';
import { Batch } from './batch.schema';
import { User } from './user.schema';

export type StudentEnrollmentDocument = HydratedDocument<StudentEnrollment>;

@Schema({ timestamps: true })
export class StudentEnrollment {
  @Prop({ type: Types.ObjectId, ref: 'University', required: true })
  university: University | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Batch', required: true })
  batch: Batch | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student: User | Types.ObjectId;

  @Prop({ default: '' })
  rollNumber: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const StudentEnrollmentSchema =
  SchemaFactory.createForClass(StudentEnrollment);

StudentEnrollmentSchema.index({ batch: 1, student: 1 }, { unique: true });
StudentEnrollmentSchema.index({ university: 1, student: 1 }, { unique: true });

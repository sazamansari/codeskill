import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import * as crypto from 'crypto';
import { University } from './university.schema';
import { User } from './user.schema';

export type BatchDocument = HydratedDocument<Batch>;

@Schema({ timestamps: true })
export class Batch {
  @Prop({ type: Types.ObjectId, ref: 'University', required: true })
  university: University | Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '' })
  department: string;

  @Prop({ required: true })
  graduationYear: number;

  @Prop({ unique: true })
  inviteCode: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);

BatchSchema.pre('save', async function (next: any) {
  if (!this.inviteCode) {
    const uniqueString = crypto.randomBytes(4).toString('hex').toUpperCase();
    this.inviteCode = `${this.graduationYear}-${uniqueString}`;
  }
  next();
});

BatchSchema.index({ university: 1, name: 1 }, { unique: true });

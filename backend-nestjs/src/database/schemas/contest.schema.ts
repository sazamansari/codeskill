import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ProblemMetadata } from './problem-metadata.schema';
import { User } from './user.schema';

export type ContestDocument = HydratedDocument<Contest>;

class AntiCheatConfig {
  @Prop({ default: true })
  enableFullscreen: boolean;

  @Prop({ default: true })
  enableCopyProtect: boolean;

  @Prop({ default: true })
  enablePasteProtect: boolean;

  @Prop({ default: true })
  enableDevToolsDetect: boolean;

  @Prop({ default: true })
  enableTabSwitchDetect: boolean;

  @Prop({ default: true })
  enableMultipleDeviceProtect: boolean;

  @Prop({ default: true })
  enableWatermark: boolean;

  @Prop({ default: 5 })
  warningLimit: number;

  @Prop({ default: true })
  autoSubmitOnViolation: boolean;
}

@Schema({ timestamps: true })
export class Contest {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop([{ type: Types.ObjectId, ref: 'ProblemMetadata' }])
  problems: ProblemMetadata[] | Types.ObjectId[];

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop()
  password?: string;

  @Prop({ type: AntiCheatConfig, default: () => ({}) })
  antiCheatConfig: AntiCheatConfig;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  participants: User[] | Types.ObjectId[];
}

export const ContestSchema = SchemaFactory.createForClass(Contest);

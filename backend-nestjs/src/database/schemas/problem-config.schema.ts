import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ProblemMetadata } from './problem-metadata.schema';

export type ProblemConfigDocument = HydratedDocument<ProblemConfig>;

@Schema({ timestamps: true })
export class ProblemConfig {
  @Prop({ type: Types.ObjectId, ref: 'ProblemMetadata', required: true })
  metadataId: ProblemMetadata | Types.ObjectId;

  @Prop([String])
  supportedLanguages: string[];

  @Prop({ default: 2000 })
  timeLimit: number;

  @Prop({ default: 256 })
  memoryLimit: number;

  @Prop({ default: 1 })
  cpuLimit: number;

  @Prop({ default: 8 })
  stackSize: number;

  @Prop({ default: 10 })
  outputLimit: number;

  @Prop({ default: 1024 * 1024 })
  maxSourceCodeSize: number;

  @Prop({ default: true })
  enableCustomInput: boolean;

  @Prop({ default: false })
  allowMultipleFiles: boolean;

  @Prop({ default: false })
  enableFileUpload: boolean;

  @Prop({ type: Map, of: String })
  starterCode?: Map<string, string>;

  @Prop({ type: Map, of: String })
  referenceSolution?: Map<string, string>;

  @Prop({ default: false })
  hasCustomChecker: boolean;

  @Prop({ type: Map, of: String })
  customCheckerCode?: Map<string, string>;
}

export const ProblemConfigSchema = SchemaFactory.createForClass(ProblemConfig);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ProblemMetadata } from './problem-metadata.schema';

export type ProblemTestCaseDocument = HydratedDocument<ProblemTestCase>;

class InternalTestCase {
  @Prop()
  input?: string;

  @Prop()
  output?: string;

  @Prop({ default: false })
  isHidden: boolean;

  @Prop()
  explanation?: string;

  @Prop({ default: 1 })
  weight: number;
}

@Schema({ timestamps: true })
export class ProblemTestCase {
  @Prop({ type: Types.ObjectId, ref: 'ProblemMetadata', required: true })
  metadataId: ProblemMetadata | Types.ObjectId;

  @Prop([InternalTestCase])
  cases: InternalTestCase[];

  @Prop()
  s3BucketUrl?: string;

  @Prop()
  testCaseGeneratorCode?: string;
}

export const ProblemTestCaseSchema =
  SchemaFactory.createForClass(ProblemTestCase);

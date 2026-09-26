import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ProblemMetadata } from './problem-metadata.schema';

export type ProblemStatementDocument = HydratedDocument<ProblemStatement>;

class SampleTestCase {
  @Prop()
  input?: string;

  @Prop()
  output?: string;

  @Prop()
  explanation?: string;
}

@Schema({ timestamps: true })
export class ProblemStatement {
  @Prop({ type: Types.ObjectId, ref: 'ProblemMetadata', required: true })
  metadataId: ProblemMetadata | Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop()
  inputFormat?: string;

  @Prop()
  outputFormat?: string;

  @Prop()
  constraints?: string;

  @Prop([SampleTestCase])
  samples: SampleTestCase[];
}

export const ProblemStatementSchema =
  SchemaFactory.createForClass(ProblemStatement);

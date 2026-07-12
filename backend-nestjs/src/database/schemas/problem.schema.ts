import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ProblemDocument = HydratedDocument<Problem>;

class TestCase {
  @Prop({ required: true })
  input: string;

  @Prop({ required: true })
  output: string;

  @Prop({ default: false })
  isHidden: boolean;

  @Prop()
  explanation?: string;
}

class ProblemStats {
  @Prop({ default: 0 })
  totalSubmissions: number;

  @Prop({ default: 0 })
  acceptedSubmissions: number;

  @Prop({ default: 0 })
  acceptanceRate: number;
}

@Schema({ timestamps: true })
export class Problem {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' })
  difficulty: string;

  @Prop()
  constraints?: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: 2000 })
  timeLimit: number;

  @Prop({ default: 256 })
  memoryLimit: number;

  @Prop({
    type: Map,
    of: String,
    default: {
      javascript: 'function solve() {\n  // Write your code here\n}\n',
      python: 'def solve():\n    # Write your code here\n    pass\n',
      java: 'class Solution {\n    public void solve() {\n        // Write your code here\n    }\n}\n',
    },
  })
  starterCode: Map<string, string>;

  @Prop([TestCase])
  testCases: TestCase[];

  @Prop([String])
  hints: string[];

  @Prop()
  editorial?: string;

  @Prop({ type: ProblemStats, default: () => ({}) })
  stats: ProblemStats;

  @Prop({ default: false })
  isPublished: boolean;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);

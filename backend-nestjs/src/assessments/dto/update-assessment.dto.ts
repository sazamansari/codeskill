import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAssessmentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['mcq', 'coding', 'hybrid'])
  type?: 'mcq' | 'coding' | 'hybrid';

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  durationMinutes?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  passingMarks?: number;

  @IsBoolean()
  @IsOptional()
  negativeMarking?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  questionIds?: string[];

  @IsOptional()
  startTime?: string;

  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['draft', 'published', 'ongoing', 'completed', 'archived'])
  status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'archived';

  @IsBoolean()
  @IsOptional()
  shuffleQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  shuffleOptions?: boolean;

  @IsBoolean()
  @IsOptional()
  showResultImmediately?: boolean;

  @IsBoolean()
  @IsOptional()
  allowReview?: boolean;

  @IsOptional()
  proctoring?: {
    enforceFullscreen?: boolean;
    blockCopyPaste?: boolean;
    detectTabSwitch?: boolean;
    maxTabSwitches?: number;
    autoSubmitOnViolation?: boolean;
  };

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  instructions?: string[];
}

export class UpdateAssessmentStatusDto {
  @IsString()
  @IsEnum(['draft', 'published', 'ongoing', 'completed', 'archived'])
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'archived';
}

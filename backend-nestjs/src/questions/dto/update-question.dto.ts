import {
  IsString,
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsNumber,
  IsIn,
  ArrayUnique,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateQuestionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  question?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(4)
  @ArrayUnique()
  @IsString({ each: true })
  options?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  correctAnswer?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtopic?: string;

  @ApiPropertyOptional({ enum: ['easy', 'medium', 'hard'] })
  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  marks?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  negativeMarks?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ enum: ['single_choice', 'multiple_choice'] })
  @IsOptional()
  @IsIn(['single_choice', 'multiple_choice'])
  questionType?: 'single_choice' | 'multiple_choice';

  @ApiPropertyOptional({
    enum: ['pending', 'approved', 'rejected', 'archived'],
  })
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected', 'archived'])
  status?: 'pending' | 'approved' | 'rejected' | 'archived';

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

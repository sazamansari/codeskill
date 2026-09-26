import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsNumber,
  IsOptional,
  IsIn,
  ArrayUnique,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: 'What is the time complexity of binary search in the worst case?' })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    example: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    description: 'Array of at least 4 unique options',
  })
  @IsArray()
  @ArrayMinSize(4, { message: 'A question must have at least 4 options.' })
  @ArrayUnique({ message: 'Options must be unique (no duplicate choices).' })
  @IsString({ each: true, message: 'Each option must be a valid string.' })
  options: string[];

  @ApiProperty({
    example: 1,
    description: 'Zero-based index of the correct option (0, 1, 2, or 3)',
  })
  @IsNumber()
  correctAnswer: number;

  @ApiPropertyOptional({ example: 'Binary search repeatedly divides the search interval in half, leading to O(log n) time complexity.' })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ example: 'Data Structures & Algorithms' })
  @IsNotEmpty()
  @IsString()
  topic: string;

  @ApiPropertyOptional({ example: 'Searching Algorithms' })
  @IsOptional()
  @IsString()
  subtopic?: string;

  @ApiPropertyOptional({ enum: ['easy', 'medium', 'hard'], default: 'medium' })
  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard' = 'medium';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  marks?: number = 1;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  negativeMarks?: number = 0;

  @ApiPropertyOptional({ default: 'general' })
  @IsOptional()
  @IsString()
  language?: string = 'general';

  @ApiPropertyOptional({ enum: ['single_choice', 'multiple_choice'], default: 'single_choice' })
  @IsOptional()
  @IsIn(['single_choice', 'multiple_choice'])
  questionType?: 'single_choice' | 'multiple_choice' = 'single_choice';

  @ApiPropertyOptional({ type: [String], example: ['binary-search', 'algorithms', 'time-complexity'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

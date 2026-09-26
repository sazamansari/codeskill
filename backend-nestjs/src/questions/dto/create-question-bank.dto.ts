import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionBankDto {
  @ApiProperty({ example: 'Operating Systems Midterm Bank' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Curated pool of questions for OS semester exam' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Operating Systems' })
  @IsNotEmpty()
  @IsString()
  topic: string;

  @ApiPropertyOptional({ type: [String], description: 'Array of Question ObjectIDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questions?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

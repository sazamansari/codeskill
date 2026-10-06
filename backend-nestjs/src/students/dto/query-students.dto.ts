import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryStudentsDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Search by UID, name, or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by Department' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Filter by Batch' })
  @IsOptional()
  @IsString()
  batch?: string;

  @ApiPropertyOptional({ description: 'Filter by Semester' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  semester?: number;

  @ApiPropertyOptional({
    description: 'Filter by active status ("true" / "false")',
  })
  @IsOptional()
  @IsString()
  isActive?: string;
}

import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StudentProfileDto } from './create-student.dto';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 'CU202600123' })
  @IsOptional()
  @IsString()
  uid?: string;

  @ApiPropertyOptional({ example: 'Rahul Sharma' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'rahul.cu2026@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  forcePasswordChange?: boolean;

  @ApiPropertyOptional({ type: StudentProfileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => StudentProfileDto)
  studentProfile?: StudentProfileDto;
}

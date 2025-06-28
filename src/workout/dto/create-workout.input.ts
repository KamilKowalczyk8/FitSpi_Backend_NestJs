import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkoutInput {
  @ApiProperty({ example: '2024-06-21' })
  @IsDateString()
  date: Date;

  @ApiProperty({ example: 'Upper body day', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
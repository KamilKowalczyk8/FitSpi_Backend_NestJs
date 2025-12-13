import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkoutType } from '../workout-type.enum';

export class CreateWorkoutInput {
  @ApiProperty({ example: '2024-06-21' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Upper body day', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: WorkoutType.Training,
    enum: WorkoutType,
    required: false,
    description: 'Typ treningu: 1 = Training, 2 = Rest',
  })
  
  @IsOptional()
  @IsEnum(WorkoutType)
  workout_type?: WorkoutType;
}

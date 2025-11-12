import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class AssignWorkoutDto {
  @IsNumber()
  workoutId: number;

  @IsNumber()
  traineeId: number;

  @IsOptional()
  @IsDateString()
  assignedForDate?: string;
}

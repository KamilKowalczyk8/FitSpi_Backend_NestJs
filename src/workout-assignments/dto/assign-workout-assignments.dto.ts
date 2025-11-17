import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class AssignWorkoutAssignmentsDto {
  @IsNumber()
  workoutId: number;

  @IsNumber()
  traineeId: number;

  @IsOptional()
  @IsDateString()
  assignedForDate?: string;
}

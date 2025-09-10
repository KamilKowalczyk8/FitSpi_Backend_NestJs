import { ApiProperty } from '@nestjs/swagger';
import { WeightUnits } from '../weight_units.enum';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateExerciseInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  sets: number;

  @IsNumber()
  @IsPositive()
  reps: number;

  @IsNumber()
  @IsPositive()
  weight: number;

  @IsEnum(WeightUnits)
  weightUnits: WeightUnits;

  @IsString()
  @IsNotEmpty()
  day: string; 

  @ApiProperty({ example: 2 })
  @IsInt()
  workoutId: number;
}

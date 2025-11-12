import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { WeightUnits } from '../weight_units.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExerciseInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sets?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  reps?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight?: number;

  @ApiPropertyOptional({ enum: WeightUnits })
  @IsOptional()
  @IsEnum(WeightUnits)
  weightUnits?: WeightUnits;
}
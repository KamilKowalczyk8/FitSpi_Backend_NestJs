import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { MealType } from '../entities/meal-type.enum';

export class UpdateFoodDto {
  @ApiPropertyOptional({ example: '2025-10-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({ enum: MealType, example: MealType.Lunch })
  @IsOptional()
  @IsEnum(MealType)
  meal?: MealType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  grams?: number;
}
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt } from 'class-validator';
import { MealType } from '../entities/meal-type.enum'; 

export class CopyMealDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  sourceDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  targetDate: Date;

  @ApiProperty({ enum: MealType })
  @IsEnum(MealType)
  meal: MealType; 
}
import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../entities/gender.enum";
import { IsDateString, IsEnum, IsNumber } from "class-validator";
import { ActivityLevel } from "../entities/activity-level.enum";
import { DietGoal } from "../entities/goal.enum";

export class CreateUserProfileDto {
  @ApiProperty({ enum: Gender, example: Gender.MALE, description: 'Płeć' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '1995-05-15', description: 'Data urodzenia (YYYY-MM-DD)' })
  @IsDateString()
  date_of_birth: string;

  @ApiProperty({ example: 180, description: 'Wzrost w cm' })
  @IsNumber()
  height_cm: number;

  @ApiProperty({ example: 85.5, description: 'Waga w kg' })
  @IsNumber()
  weight_kg: number;

  @ApiProperty({ 
    enum: ActivityLevel, 
    example: ActivityLevel.MODERATE, 
    description: 'Poziom aktywności (1.2 - 1.9)' 
  })
  @IsEnum(ActivityLevel)
  activity_level: ActivityLevel;

  @ApiProperty({ 
    enum: DietGoal, 
    example: DietGoal.LOSE_WEIGHT, 
    description: 'Cel diety' 
  })
  @IsEnum(DietGoal)
  goal: DietGoal;
}

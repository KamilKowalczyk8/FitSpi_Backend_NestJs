import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDataURI, IsDate, IsEnum, IsInt, IsNumber, IsPositive } from "class-validator";
import { MealType } from "../entities/meal-type.enum";

export class CreateFoodDto {

    @ApiProperty()
    @IsInt()
    productId: number;

    @ApiProperty({ example: '2025-10-30' })
    @Type(() => Date)
    @IsDate()
    date: Date;

    @ApiProperty({ enum: MealType, example: MealType.Sniadanie })
    @IsEnum(MealType)
    meal: MealType;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    grams:number;
    
}

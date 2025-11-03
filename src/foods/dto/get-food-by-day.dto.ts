import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer/types/decorators/type.decorator";
import { IsDate } from "class-validator";

export class GetFoodByDayDto {
    @ApiProperty({
        description: 'Data w formacie YYYY-MM-DD',
        example: '2025-10-31',
    })
    @Type(() => Date)
    @IsDate()
    date: Date;
}
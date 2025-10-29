import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CopyFoodDto {
  @ApiProperty({ example: '2025-11-01', description: 'Dzień, na który skopiować wpis' })
  @Type(() => Date)
  @IsDate()
  targetDate: Date;
}
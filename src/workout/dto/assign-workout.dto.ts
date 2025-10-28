import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';

export class AssignWorkoutDto {
  @ApiProperty({ example: 5, description: 'ID podopiecznego (client_id)' })
  @IsInt()
  clientId: number;

  @ApiProperty({ example: '2025-10-30', description: 'Data, na którą trening ma być przypisany' })
  @IsDateString()
  date: string;
}
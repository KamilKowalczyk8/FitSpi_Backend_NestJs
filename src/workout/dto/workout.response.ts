import { ApiProperty } from '@nestjs/swagger';

export class WorkoutResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  created_at: Date;
}
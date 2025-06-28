import { ApiProperty } from '@nestjs/swagger';

export class WorkoutResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  created_at: Date;
}
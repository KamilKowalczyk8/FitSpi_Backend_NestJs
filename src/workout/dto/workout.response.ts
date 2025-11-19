import { ApiProperty } from '@nestjs/swagger';
import { WorkoutStatus } from '../workout-status.enum';

export class WorkoutResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ enum: WorkoutStatus })
  status: WorkoutStatus;
}
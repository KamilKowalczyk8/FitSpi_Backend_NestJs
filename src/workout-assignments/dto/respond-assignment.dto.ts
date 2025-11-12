import { IsBoolean } from 'class-validator';

export class RespondAssignmentDto {
  @IsBoolean()
  accept: boolean;
}

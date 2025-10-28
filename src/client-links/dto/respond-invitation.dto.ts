import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class RespondInvitationDto {
  @ApiProperty({ description: 'true to accept, false to reject' })
  @IsBoolean()
  accept: boolean;
}
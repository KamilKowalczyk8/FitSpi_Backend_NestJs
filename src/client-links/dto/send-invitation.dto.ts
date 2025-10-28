import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendInvitationDto {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail()
  @IsNotEmpty()
  clientEmail: string;
}
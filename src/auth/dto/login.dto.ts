import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ example: 'jan.kowalski@example.com' })
  @IsEmail({}, { message: 'Nieprawidłowy adres e-mail' })
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  @IsNotEmpty({ message: 'Hasło jest wymagane' })
  password: string;
  
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  rememberMe?: boolean;
}

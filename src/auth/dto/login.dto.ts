import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jan.kowalski@example.com' })
  @IsEmail({}, { message: 'Nieprawidłowy adres e-mail' })
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  @IsNotEmpty({ message: 'Hasło jest wymagane' })
  password: string;
}

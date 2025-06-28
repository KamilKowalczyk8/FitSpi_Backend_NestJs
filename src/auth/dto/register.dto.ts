import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { MatchPasswords } from '../validators/match-passwords.validator'; // to utworzymy niżej

export class RegisterDto {
  @ApiProperty({ example: 'Jan' })
  @IsNotEmpty({ message: 'Imię jest wymagane' })
  @Matches(/^\S.*\S$|^\S$/, { message: 'Imię nie może zaczynać się ani kończyć spacją' })
  first_name: string;

  @ApiProperty({ example: 'Kowalski' })
  @IsNotEmpty({ message: 'Nazwisko jest wymagane' })
  @Matches(/^\S.*\S$|^\S$/, { message: 'Nazwisko nie może zaczynać się ani kończyć spacją' })
  last_name: string;

  @ApiProperty({ example: 'jan.kowalski@example.com' })
  @IsEmail({}, { message: 'Nieprawidłowy adres e-mail' })
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  @MinLength(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
  @Matches(/[A-Z]/, { message: 'Hasło musi zawierać wielką literę' })
  @Matches(/[a-z]/, { message: 'Hasło musi zawierać małą literę' })
  @Matches(/[0-9]/, { message: 'Hasło musi zawierać cyfrę' })
  @Matches(/[@$!%*?&]/, { message: 'Hasło musi zawierać znak specjalny' })
  password: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  @Validate(MatchPasswords, ['password'], {
    message: 'Powtórzone hasło nie pasuje do hasła',
  })
  confirmPassword: string;
}

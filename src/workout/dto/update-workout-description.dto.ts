import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateWorkoutDescriptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Opis treningu nie może być pusty' })
  @MaxLength(255, { message: 'Opis treningu może mieć maksymalnie 255 znaków' })
  description: string;
}

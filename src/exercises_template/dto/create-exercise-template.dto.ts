import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExerciseTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

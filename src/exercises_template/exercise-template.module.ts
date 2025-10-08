import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseTemplateService } from './exercise-template.service';
import { ExerciseTemplateController } from './exercise-template.controller';
import { ExerciseTemplate } from './exercise-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseTemplate])],
  controllers: [ExerciseTemplateController],
  providers: [ExerciseTemplateService],
  exports: [ExerciseTemplateService],
})
export class ExerciseTemplateModule {}

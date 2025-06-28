import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, User])],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService], 
})
export class ExerciseModule {}

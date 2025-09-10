import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { User } from '../users/user.entity';
import { Workout } from 'src/workout/workout.entity';
import { WorkoutModule } from 'src/workout/workout.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, User, Workout]),
    WorkoutModule,
  ],
  
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService], 
})
export class ExerciseModule {}

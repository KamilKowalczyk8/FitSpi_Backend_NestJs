import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './workout.entity';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { User } from 'src/users/user.entity';
import { ClientLink } from 'src/client-links/entities/client-link.entity';
import { Exercise } from 'src/exercises/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Workout,
    User,
    ClientLink, 
    Exercise
  ]),
],
  providers: [WorkoutService],
  controllers: [WorkoutController],
  exports: [WorkoutService],
})
export class WorkoutModule {}

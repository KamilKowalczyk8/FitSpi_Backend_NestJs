import { Module } from '@nestjs/common';
import { WorkoutAssignmentsService } from './workout-assignments.service';
import { WorkoutAssignmentsController } from './workout-assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutAssignment } from './entities/workout-assignment.entity';
import { Workout } from 'src/workout/workout.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutAssignment, Workout, User])],
  controllers: [WorkoutAssignmentsController],
  providers: [WorkoutAssignmentsService],
  exports: [WorkoutAssignmentsService],
})
export class WorkoutAssignmentsModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutAssignmentDto } from './dto/create-workout-assignment.dto';
import { UpdateWorkoutAssignmentDto } from './dto/update-workout-assignment.dto';
import { User } from 'src/users/user.entity';
import { Workout } from 'src/workout/workout.entity';
import { WorkoutAssignment, WorkoutAssignmentStatus } from './entities/workout-assignment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignWorkoutAssignmentsDto } from './dto/assign-workout-assignments.dto';
import { RespondAssignmentDto } from './dto/respond-assignment.dto';



@Injectable()
export class WorkoutAssignmentsService {
  constructor(
    @InjectRepository(WorkoutAssignment)
    private assignmentRepo: Repository<WorkoutAssignment>,

    @InjectRepository(Workout)
    private workoutRepo: Repository<Workout>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async assignWorkout(trainerId: number, dto: AssignWorkoutAssignmentsDto) {
    const { workoutId, traineeId, assignedForDate } = dto;

    const workout = await this.workoutRepo.findOne({ where: { id: workoutId } });
    if (!workout) throw new NotFoundException('Nie znaleziono treningu');

    const trainee = await this.userRepo.findOne({ where: { user_id: traineeId } });
    if (!trainee) throw new NotFoundException('Nie znaleziono podpoiecznego');

    const trainer = await this.userRepo.findOne({ where: { user_id: trainerId }});
    if (!trainer) throw new NotFoundException('Nie znaleziono trenera');

    const assignment = this.assignmentRepo.create({
      workout,
      trainee,
      trainer,
      assignedForDate,
      status: WorkoutAssignmentStatus.Pending,
    });

    return this.assignmentRepo.save(assignment);
  }

  async getAssignmentsForTrainer(trainerId: number) {
    return this.assignmentRepo.find({
      where: { trainer: { user_id: trainerId } },
      relations: ['trainee', 'workout'],
    });
  }

  async getPendingAssignmentsForTrainee(userId: number) {
    return this.assignmentRepo.find({
      where: { trainee: { user_id: userId }, status: WorkoutAssignmentStatus.Pending },
      relations: ['workout', 'trainer'],
    });
  }

  async getAcceptedAssignmentsForTrainee(userId: number) {
    return this.assignmentRepo.find({
      where: { trainee: { user_id: userId }, status: WorkoutAssignmentStatus.Accepted },
      relations: ['workout', 'trainer'],
    })
  }

  async respondToAssignment(userId: number, assignmentId: number , dto: RespondAssignmentDto) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId, trainee: { user_id: userId } },
    });

    if(!assignment) throw new NotFoundException('Nie znaleziono przypisania');

    assignment.status = dto.accept
      ? WorkoutAssignmentStatus.Accepted
      : WorkoutAssignmentStatus.Rejected;

    await this.assignmentRepo.save(assignment);
    return { message: dto.accept ? 'Trening zaakceptowany' : 'Trening odrzucony'};
  }

}

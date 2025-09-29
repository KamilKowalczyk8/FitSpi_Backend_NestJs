import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ExerciseResponse } from './dto/exercise.response';
import { Workout } from 'src/workout/workout.entity';
import { ExerciseTemplate } from 'src/exercises/exercises_template/exercise-template.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,

    @InjectRepository(ExerciseTemplate)
    private readonly templateRepo: Repository<ExerciseTemplate>,
  ) {}

  async create(dto: CreateExerciseInput, user: User): Promise<ExerciseResponse> {
    const workout = await this.workoutRepo.findOne({
      where: { id: dto.workoutId },
      relations: ['user'],
    });

    if (!workout || workout.user.user_id !== user.user_id) {
      throw new NotFoundException(
        'Nie znaleziono treningu przypisanego do użytkownika',
      );
    }

    const template = await this.templateRepo.findOne({
      where: { id: dto.templateId },
    });

    if (!template) {
      throw new NotFoundException('Nie znaleziono szablonu ćwiczenia');
    }

    const exercise = this.exerciseRepo.create({
      template,
      sets: dto.sets,
      reps: dto.reps,
      weight: dto.weight,
      weightUnits: dto.weightUnits,
      day: dto.day,
      workoutId: workout,
    });

    const saved = await this.exerciseRepo.save(exercise);

    return {
      id: saved.id,
      name: saved.template.name, 
      sets: saved.sets,
      reps: saved.reps,
      weight: saved.weight,
      weightUnits: saved.weightUnits,
      day: saved.day,
    };
  }

  async findAllByUser(user_id: number): Promise<ExerciseResponse[]> {
    const exercises = await this.exerciseRepo
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.template', 'template')
      .leftJoin('exercise.workoutId', 'workout')
      .leftJoin('workout.user', 'user')
      .where('user.user_id = :user_id', { user_id })
      .orderBy('exercise.day', 'ASC')
      .getMany();

    return exercises.map((ex) => ({
      id: ex.id,
      name: ex.template.name, 
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      weightUnits: ex.weightUnits,
      day: ex.day,
    }));
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ExerciseResponse } from './dto/exercise.response';
import { Workout } from 'src/workout/workout.entity';
import { ExerciseTemplate } from 'src/exercises_template/exercise-template.entity';
import { UpdateExerciseInput } from './dto/update-exercise.input';

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
      workout: workout,
    });

    const saved = await this.exerciseRepo.save(exercise);

    return {
      id: saved.id,
      name: saved.template.name, 
      templateId: saved.template.id,
      sets: saved.sets,
      reps: saved.reps,
      weight: saved.weight,
      weightUnits: saved.weightUnits,
      day: saved.day,
      workoutId: saved.workout.id,
    };
  }

  async findAllByUser(user_id: number): Promise<ExerciseResponse[]> {
    const exercises = await this.exerciseRepo
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.template', 'template')
      .leftJoinAndSelect('exercise.workout', 'workout')
      .leftJoin('workout.user', 'user')
      .where('user.user_id = :user_id', { user_id })
      .orderBy('exercise.day', 'ASC')
      .getMany();
    
    return exercises.map((ex) => {
      
      const responseItem = {
        id: ex.id,
        name: ex.template.name,
        templateId: ex.template.id,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        weightUnits: ex.weightUnits,
        day: ex.day,
        workoutId: ex.workout.id,
      };

      return responseItem;
    });
  }

  
  async updateExercise(
    exerciseId: number,
    userId: number,
    dto: UpdateExerciseInput,
  ): Promise<ExerciseResponse> {
    
    // 1. Znajdź ćwiczenie i zweryfikuj właściciela
    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
      relations: ['workout', 'workout.user', 'template'], 
    });

    if (!exercise) {
      throw new NotFoundException('Nie znaleziono ćwiczenia');
    }

    if (exercise.workout.user.user_id !== userId) {
      throw new NotFoundException('To ćwiczenie nie należy do tego użytkownika');
    }

    exercise.sets = dto.sets ?? exercise.sets;
    exercise.reps = dto.reps ?? exercise.reps;
    exercise.weight = dto.weight ?? exercise.weight;
    exercise.weightUnits = dto.weightUnits ?? exercise.weightUnits;

    const saved = await this.exerciseRepo.save(exercise);
    return {
      id: saved.id,
      name: saved.template.name,
      templateId: saved.template.id,
      sets: saved.sets,
      reps: saved.reps,
      weight: saved.weight,
      weightUnits: saved.weightUnits,
      day: saved.day,
      workoutId: saved.workout.id,
    };
  }



  async deleteExercise(exerciseId: number, userId: number): Promise<{ success: boolean }> {
    const exercise = await this.exerciseRepo.findOne({
        where: { id: exerciseId},
        relations: ['workout', 'workout.user'],
    });

    if (!exercise) {
      throw new NotFoundException('Nie znaleziono ćwiczenia');
    }

    if (exercise.workout.user.user_id !== userId) {
      throw new NotFoundException('To ćwiczenie nie należy do tego użytkownika');
    }

    await this.exerciseRepo.delete(exerciseId);
    return { success: true };
  }

}

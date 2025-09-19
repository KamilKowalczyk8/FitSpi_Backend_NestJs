import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { WeightUnits } from './weight_units.enum';
import { ExerciseResponse } from './dto/exercise.response';
import { Workout } from 'src/workout/workout.entity';

@Injectable()
export class ExerciseService {
    constructor(
        @InjectRepository(Exercise)
        private readonly exerciseRepo: Repository<Exercise>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Workout)
        private readonly workoutRepo: Repository<Workout>,
    ) {}

    async create(dto: CreateExerciseInput, user: User): Promise<ExerciseResponse> {
        const workout = await this.workoutRepo.findOne({
        where: { id: dto.workoutId },
        relations: ['user'],
        });

        if (!workout || workout.user.user_id !== user.user_id) {
            throw new NotFoundException('Nie znaleziono treningu przypisanego do użytkownika');
        }



        //.create(...) tworzy nowy obiekt klasy Exercise, 
        // ale go jeszcze nie zapisuje.
        //.save(...) — zapisuje ten obiekt do bazy danych.
        const exercise = this.exerciseRepo.create({ ...dto, workoutId:workout });
        const saved = await this.exerciseRepo.save(exercise);

        //Zwracamy tylko wybrane pola w strukturze ExerciseResponse, 
        // aby nie ujawniać całego obiektu (np. relacji z użytkownikiem)
        return {
            id: saved.id,
            name: saved.name,
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
        .leftJoin('exercise.workout', 'workout')
        .leftJoin('workout.user', 'user')
        .where('user.user_id = :user_id', { user_id })
        .orderBy('exercise.day', 'ASC')
        .getMany();

        return exercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            weightUnits: ex.weightUnits,
            day: ex.day,
    }));
  }
}
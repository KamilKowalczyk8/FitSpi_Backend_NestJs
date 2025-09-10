import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, W } from 'typeorm';
import { Workout } from './workout.entity';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { WorkoutResponse } from './dto/workout.response';
import { User } from '../users/user.entity';

@Injectable()
export class WorkoutService {
    constructor(
        @InjectRepository(Workout)
        private readonly workoutRepo: Repository<Workout>,
    ) {}

    async create(input: CreateWorkoutInput, user: User): Promise<WorkoutResponse>{
        const workout = this.workoutRepo.create({ ...input, user, workout_type: input.workout_type ?? undefined, });
        const saved = await this.workoutRepo.save(workout);
        
        return{
            id: saved.id,
            date: saved.date,
            description: saved.description,
            created_at: saved.created_at,
        };
    }

    async editNameWorkout(
        workoutId: number,
        userId: number,
        newNameWorkout: string,
    ): Promise<WorkoutResponse>{
        const workout = await this.workoutRepo.findOne({
            where: { id: workoutId, user: { user_id: userId } },
        });

        if (!workout){
            throw new Error('Nie znaleziono takiego treningu')
        }

        workout.description = newNameWorkout;

        const updated = await this.workoutRepo.save(workout);

        return {
            id: updated.id,
            date: updated.date,
            description: updated.description,
            created_at: updated.created_at,
        }
    }

    //Pobiera wszystkie treningi użytkownika na podstawie jego userId
    async findAllByUser(user_id: number): Promise<WorkoutResponse[]> {
        const workouts = await this.workoutRepo.find({
            //Szukamy treningów należących do konkretnego użytkownika.
            //Sortujemy je malejąco po dacie utworzenia (najnowsze pierwsze).
            where: { user: { user_id: user_id } },
            order: { created_at: 'DESC' },
        });

        //Każdy trening mapujemy do obiektu WorkoutResponse, 
        //żeby zwrócić tylko potrzebne dane.
        return workouts.map((wo) => ({
            id: wo.id,
            date: wo.date,
            description: wo.description,
            created_at: wo.created_at,
        }));
    }
}
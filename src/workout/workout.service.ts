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
        const workout = this.workoutRepo.create({ ...input, user });
        const saved = await this.workoutRepo.save(workout);
        
        return{
            id: saved.id,
            date: saved.date,
            description: saved.description,
            created_at: saved.created_at,
        };
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
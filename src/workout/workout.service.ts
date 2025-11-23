import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, W } from 'typeorm';
import { Workout } from './workout.entity';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { WorkoutResponse } from './dto/workout.response';
import { User } from '../users/user.entity';
import { WorkoutType } from './workout-type.enum';
import { Exercise } from 'src/exercises/exercise.entity';
import { ClientLink } from 'src/client-links/entities/client-link.entity';
import { Role } from 'src/users/role.enum';
import { LinkStatus } from 'src/client-links/entities/link-status.enum';
import { WorkoutStatus } from './workout-status.enum';

@Injectable()
export class WorkoutService {
    constructor(
        @InjectRepository(Workout)
        private readonly workoutRepo: Repository<Workout>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(ClientLink)
        private readonly clientLinkRepo: Repository<ClientLink>,
        @InjectRepository(Exercise)
        private readonly exerciseRepo: Repository<Exercise>,
    ) {}

    async create(input: CreateWorkoutInput, user: User): Promise<WorkoutResponse> {
        const date = input.date ? new Date(input.date) : new Date();

    
        const workout = this.workoutRepo.create({ 
            ...input,
            date: input.date,
            user: { user_id: user.user_id }, 
            creator: { user_id: user.user_id },
            workout_type: input.workout_type ?? WorkoutType.Training,
        });

        console.log('Tworzę trening:', workout);

        const saved = await this.workoutRepo.save(workout);

        return {
            id: saved.id,
            date: saved.date,
            description: saved.description,
            created_at: saved.created_at,
            status: saved.status
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
            status: updated.status

        }
    }

    async findAllByUser(
        user_id: number,
        status?: WorkoutStatus 
    ): Promise<WorkoutResponse[]> {
        const whereCondition: any = { user: { user_id: user_id } };
    
        if (status) {
            whereCondition.status = status;
        } else {
            whereCondition.status = WorkoutStatus.ACCEPTED;
        }

        const workouts = await this.workoutRepo.find({
            where: whereCondition,
            order: {
                date: 'DESC',      
                created_at: 'DESC' 
            },
        });

        return workouts.map((workout) => ({
            id: workout.id,
            date: workout.date,
            description: workout.description || '', 
            created_at: workout.created_at,
            status: workout.status
        }));
    }


    async deleteWorkout(workoutId: number, userId: number): Promise<{ success: boolean }> {
    const workout = await this.workoutRepo.findOne({
        where: { id: workoutId },
        relations: ['user'],
    });

    if (!workout) {
        throw new NotFoundException('Nie znaleziono treningu');
    }
    const isOwner = workout.user.user_id === userId;
    const isCreator = workout.creatorId === userId;

    if (!isOwner && !isCreator) {
        throw new ForbiddenException('Nie masz uprawnień do usunięcia tego treningu');
    }
        await this.workoutRepo.delete(workout.id); 
        return { success: true };
    }

    async assignWorkoutToClient(
        trainer: User,
        sourceWorkoutId: number,
        clientId: number,
        targetDate: Date,
    ): Promise<WorkoutResponse> {

        if (trainer.role_id !== Role.Trainer) {
            throw new ForbiddenException('Nie masz uprawnien trenerskich')
        }

        const link = await this.clientLinkRepo.findOne({
            where: {
            trainerId: trainer.user_id,
            clientId: clientId,
            status: LinkStatus.Accepted,
            },
        });
        if (!link) {
            throw new ForbiddenException('Nie jesteś trenerem tego użytkownika')
        }

        const clientUser = await this.userRepo.findOne({ where: { user_id: clientId } })
        if (!clientUser) {
            throw new NotFoundException('Nie znaleziono klienta');
        }

        const sourceWorkout = await this.workoutRepo.findOne({
            where: {
                id: sourceWorkoutId,
                user: { user_id: trainer.user_id },
            },
            relations: ['exercises', 'exercises.template'],
        });
        if (!sourceWorkout) {
            throw new NotFoundException('Nie znaleziono treningu-szablonu należącego do Ciebie');
        }

        const newWorkout = this.workoutRepo.create({
            description: sourceWorkout.description,
            date: targetDate.toISOString().split('T')[0],
            user: clientUser,
            creator: trainer,
            workout_type: sourceWorkout.workout_type,
        });
        console.log('Tworzę trening:', newWorkout);
        const savedWorkout = await this.workoutRepo.save(newWorkout);
        
        console.log('Zapisany trening:', savedWorkout);
        const newExercises = sourceWorkout.exercises.map((ex) => {
            if (!ex.template) {
                console.warn(`Pominieto cwiczenie ${ex.id} - brak szablonu`);
                return null;
            }
            return this.exerciseRepo.create({
                template: ex.template,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                weightUnits: ex.weightUnits,
                workout: savedWorkout,
            }); 
        }).filter(ex => ex !== null);

        if(newExercises.length > 0) {
            await this.exerciseRepo.save(newExercises);
        }

        return{
            id: savedWorkout.id,
            date: savedWorkout.date,
            description: savedWorkout.description,
            created_at: savedWorkout.created_at,
            status: savedWorkout.status
        };
    }

    async getWorkoutsCreatedForClient(trainerId: number, clientId: number) {
        return this.workoutRepo.find({
            where: {
                user: { user_id: clientId },
                creator: { user_id: trainerId }
            },
            order: { date: 'DESC' },
            relations: [ 'exercises' ],
        });
    }

    async createProposalForClient(
        input:CreateWorkoutInput,
        clientId: number,
        trainerId: number
    ): Promise<WorkoutResponse> {
        const client = await this.userRepo.findOne({ where: { user_id: clientId } });
            if(!client) throw new NotFoundException('Nie znaleziono klienta');

        const workout = this.workoutRepo.create({
            ...input,
            date: input.date ? new Date(input.date).toISOString() : new Date().toISOString(),            
            user: client,
            creator: { user_id: trainerId },
            status: WorkoutStatus.DRAFT
        });

        const saved = await this.workoutRepo.save(workout);
        return {
            id: saved.id,
            date: saved.date,
            description: saved.description || '', 
            created_at: saved.created_at,         
            status: saved.status
        };
    }

    async sendWorkoutToClient(workoutId: number, trainerId: number): Promise<WorkoutResponse> {
        const workout = await this.workoutRepo.findOne({
            where: { id: workoutId, creatorId: trainerId }, 
        });

        if (!workout) throw new NotFoundException('Nie znaleziono treningu');
        workout.status = WorkoutStatus.PENDING; 
        const saved = await this.workoutRepo.save(workout);
        return {
            id: saved.id,
            date: saved.date,
            description: saved.description || '',
            created_at: saved.created_at,
            status: saved.status
        };
    }

    async acceptWorkout(
        workoutId: number,
        clientId: number,
        targetDate: Date
    ): Promise<WorkoutResponse> {     
      const originalWorkout = await this.workoutRepo.findOne({
        where: {
            id: workoutId,
            user: { user_id: clientId },
        },
        relations: ['exercises', 'exercises.template'],
      });

      if (!originalWorkout) {
        throw new NotFoundException(
            'Nie znalezniono treningu lub nie masz do niego uprawnien',
        );
      }

      const newWorkout = this.workoutRepo.create({
        description: originalWorkout.description,
        workout_type: originalWorkout.workout_type,
        date: targetDate.toISOString().split('T')[0],
        status: WorkoutStatus.ACCEPTED,
        user: { user_id: clientId } as User,
        creator: originalWorkout.creator,
        creatorId: originalWorkout.creatorId,
      });

      const savedNewWorkout = await this.workoutRepo.save(newWorkout);

      if (originalWorkout.exercises && originalWorkout.exercises.length > 0) {
      const newExercises = originalWorkout.exercises
        .map((ex) => {
          if (!ex.template) return null;
          return this.exerciseRepo.create({
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            weightUnits: ex.weightUnits,
            workout: savedNewWorkout, 
            template: ex.template,
          });
        })
        .filter((ex) => ex !== null);

       if (newExercises.length > 0) {
         await this.exerciseRepo.save(newExercises);
       }
      }
      originalWorkout.status = WorkoutStatus.DOWNLOADED;

      await this.workoutRepo.save(originalWorkout);

      console.log(
      `Zaakceptowano trening. Oryginał (ID: ${workoutId}) oznaczony jako POBRANY. Nowa kopia ma ID: ${savedNewWorkout.id}`,
      );

      return {
        id: savedNewWorkout.id,
        date: savedNewWorkout.date,
        description: savedNewWorkout.description || '',
        created_at: savedNewWorkout.created_at,
        status: savedNewWorkout.status,
      };
    }

    async rejectWorkout(
        workoutId: number,
        clientId: number,
    ): Promise<WorkoutResponse> {
        const workout = await this.workoutRepo.findOne({
            where: {
                id: workoutId,
                user: { user_id: clientId },
            }, 
        });

        if (!workout) {
            throw new NotFoundException(
                'Nie znaleziono treningu lub nie masz do niego praw.',
            );
        }

        workout.status = WorkoutStatus.REJECTED;
        const updatedWorkout = await this.workoutRepo.save(workout);

        return {
            id: updatedWorkout.id,
            date: updatedWorkout.date,
            description: updatedWorkout.description || '',
            created_at: updatedWorkout.created_at,
            status: updatedWorkout.status,
        };
    }
     
}
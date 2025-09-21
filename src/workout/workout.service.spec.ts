import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutService } from './workout.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workout } from './workout.entity';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { WorkoutType } from './workout-type.enum';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let repo: Repository<Workout>;

    const mockUser: User = {
        user_id: 2,
        email: 'kamil@example.com',
        first_name: 'Kamil',
        last_name: 'Kowalbv',
        is_active: true,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date(), // <- tutaj ustaw prawidłową datę
        password: '',
        workouts: [],
        hashPassword: jest.fn(),
        comparePassword: jest.fn().mockResolvedValue(true),
        safeResponse: jest.fn().mockReturnValue({
            user_id: 2,
            email: 'kamil@example.com',
            first_name: 'Kamil',
            last_name: 'Kowalbv',
            is_active: true,
            role_id: 2,
            created_at: new Date(),
            updated_at: new Date(),
            password: '',
            workouts: [],
        }),
    };


  const workoutEntity: Workout = {
      id: 1,
      date: new Date(),
      description: 'Testowy trening',
      created_at: new Date(),
      user: mockUser,
      workout_type: WorkoutType.Training,
      exercises: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        {
          provide: getRepositoryToken(Workout),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
        provide: getRepositoryToken(User),
        useValue: {
          findOne: jest.fn(),
          save: jest.fn(),
          create: jest.fn(),
        },
      },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    repo = module.get<Repository<Workout>>(getRepositoryToken(Workout));
  });

  it('should create and save a workout', async () => {
    const input: CreateWorkoutInput = {
      date: new Date('2025-09-13'),
      description: 'Testowy trening',
      workout_type: WorkoutType.Training,
    };

    jest.spyOn(repo, 'create').mockReturnValue(workoutEntity);
    jest.spyOn(repo, 'save').mockResolvedValue(workoutEntity);

    const result = await service.create(input, mockUser);

    expect(repo.create).toHaveBeenCalledWith({
      ...input,
      date: input.date,
      user: { user_id: mockUser.user_id },
      workout_type: input.workout_type,
    });
    expect(repo.save).toHaveBeenCalledWith(workoutEntity);
    expect(result).toEqual({
      id: 1,
      date: workoutEntity.date,
      description: workoutEntity.description,
      created_at: workoutEntity.created_at,
    });
  });

  it('should delete a workout', async () => {
  jest.spyOn(repo, 'findOne').mockResolvedValue(workoutEntity);
  jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);

  const result = await service.deleteWorkout(1, mockUser.user_id);

  expect(repo.findOne).toHaveBeenCalledWith({
    where: { id: 1, user: { user_id: mockUser.user_id } },
  });
  expect(repo.delete).toHaveBeenCalledWith({ id: 1, user: { user_id: mockUser.user_id } });
  expect(result).toEqual({ success: true });
});


  it('should throw error if workout not found on delete', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    await expect(service.deleteWorkout(1, mockUser.user_id)).rejects.toThrow(
      'Nie znaleziono takiego treningu lub nie należy do tego użytkownika'
    );
  });
});

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        {
          provide: getRepositoryToken(Workout),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
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

    const user: User = {
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


    const workoutEntity = { ...input, user, id: 1, created_at: new Date() };

    jest.spyOn(repo, 'create').mockReturnValue(workoutEntity as Workout);
    jest.spyOn(repo, 'save').mockResolvedValue(workoutEntity as Workout);

    const result = await service.create(input, user);

    expect(repo.create).toHaveBeenCalledWith({ ...input, user, workout_type: input.workout_type });
    expect(repo.save).toHaveBeenCalledWith(workoutEntity);
    expect(result).toEqual({
      id: 1,
      date: input.date,
      description: input.description,
      created_at: workoutEntity.created_at,
    });
  });
});

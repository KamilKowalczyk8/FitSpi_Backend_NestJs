import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseService } from './exercise.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { Workout } from 'src/workout/workout.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { WeightUnits } from './weight_units.enum';
import { NotFoundException } from '@nestjs/common';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let exerciseRepo: Repository<Exercise>;
  let workoutRepo: Repository<Workout>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        {
          provide: getRepositoryToken(Exercise),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Workout),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
            provide: getRepositoryToken(User),
            useValue: {},
        },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
    exerciseRepo = module.get<Repository<Exercise>>(getRepositoryToken(Exercise));
    workoutRepo = module.get<Repository<Workout>>(getRepositoryToken(Workout));
  });

  it('should create and save an exercise', async () => {
    const user: User = { user_id: 1 } as User;

    const workout: Workout = {
      id: 10,
      user,
    } as Workout;

    const dto: CreateExerciseInput = {
      name: 'Squat',
      sets: 3,
      reps: 10,
      weight: 100,
      weightUnits: WeightUnits.KG,
      day: 'Monday',
      workoutId: workout.id,
    };

    const exerciseEntity = { ...dto, workoutId: workout, id: 99 };

    jest.spyOn(workoutRepo, 'findOne').mockResolvedValue(workout);
    jest.spyOn(exerciseRepo, 'create').mockReturnValue(exerciseEntity as Exercise);
    jest.spyOn(exerciseRepo, 'save').mockResolvedValue(exerciseEntity as Exercise);

    const result = await service.create(dto, user);

    expect(workoutRepo.findOne).toHaveBeenCalledWith({
      where: { id: dto.workoutId },
      relations: ['user'],
    });

    expect(exerciseRepo.create).toHaveBeenCalledWith({ ...dto, workoutId: workout });
    expect(exerciseRepo.save).toHaveBeenCalledWith(exerciseEntity);

    expect(result).toEqual({
      id: 99,
      name: 'Squat',
      sets: 3,
      reps: 10,
      weight: 100,
      weightUnits: WeightUnits.KG,
      day: 'Monday',
    });
  });

  it('should throw NotFoundException if workout not found or not owned by user', async () => {
    const user: User = { user_id: 1 } as User;
    const dto: CreateExerciseInput = { workoutId: 999 } as CreateExerciseInput;

    jest.spyOn(workoutRepo, 'findOne').mockResolvedValue(null);

    await expect(service.create(dto, user)).rejects.toThrow(NotFoundException);
  });
});

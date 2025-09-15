import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should validate and register a new user', async () => {
    const dto = {
      first_name: 'Jan',
      last_name: 'Kowalski',
      email: 'jan@example.com',
      password: 'StrongP@ss1',
      confirmPassword: 'StrongP@ss1',
    };

    mockUserRepo.findOne.mockResolvedValue(null);
    mockUserRepo.create.mockReturnValue(dto);
    mockUserRepo.save.mockResolvedValue({ ...dto, user_id: 1 });

    const result = await service.register(dto);

    expect(result.token).toBe('mocked-jwt-token');
    expect(result.user.email).toBe('jan@example.com');
  });

  it('should throw if user not found during login', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);

    await expect(
      service.login({ email: 'notfound@example.com', password: 'test123' }),
    ).rejects.toThrow('Nieprawidłowe dane logowania');
  });

  it('should fail login if password is incorrect', async () => {
  const plainPassword = 'CorrectP@ss1';
  const wrongPassword = 'WrongP@ss1';

  const user = {
    user_id: 1,
    email: 'jan@example.com',
    password: await bcrypt.hash(plainPassword, 10),
    is_active: true,
    role_id: 2,
  };

  mockUserRepo.findOne.mockResolvedValue(user);

  await expect(
    service.login({ email: user.email, password: wrongPassword }),
  ).rejects.toThrow('Nieprawidłowe dane logowania');
});


  it('should throw if password does not match', async () => {
    const user = {
      email: 'jan@example.com',
      password: await bcrypt.hash('correctPass1!', 10),
      is_active: true,
    };

    mockUserRepo.findOne.mockResolvedValue(user);

    await expect(
      service.login({ email: 'jan@example.com', password: 'wrongPass' }),
    ).rejects.toThrow('Nieprawidłowe dane logowania');
  });

  it('should login successfully with correct credentials', async () => {
    const user = {
      user_id: 1,
      email: 'jan@example.com',
      password: await bcrypt.hash('StrongP@ss1', 10),
      is_active: true,
      role_id: 2,
    };

    mockUserRepo.findOne.mockResolvedValue(user);

    const result = await service.login({
      email: 'jan@example.com',
      password: 'StrongP@ss1',
    });

    expect(result.access_token).toBe('mocked-jwt-token');
    expect(result.user.email).toBe('jan@example.com');
  });
});

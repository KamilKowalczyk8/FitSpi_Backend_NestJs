import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user and return response', async () => {
    const dto = {
      first_name: 'Jan',
      last_name: 'Kowalski',
      email: 'jan@example.com',
      password: 'StrongP@ss1',
      confirmPassword: 'StrongP@ss1',
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockAuthService.register.mockResolvedValue({ user: dto, token: 'jwt-token' });

    await controller.register(dto, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ user: dto, token: 'jwt-token' });
  });

  it('should login and set cookie', async () => {
    const dto = {
      email: 'jan@example.com',
      password: 'StrongP@ss1',
    };

    const mockRes = {
      cookie: jest.fn(),
    };

    mockAuthService.login.mockResolvedValue({
      token: 'jwt-token',
      user: { email: dto.email },
    });

    const result = await controller.login(dto, mockRes as any);

    expect(mockRes.cookie).toHaveBeenCalledWith(
      'token',
      'jwt-token',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'strict',
      }),
    );

    expect(result.success).toBe(true);
    expect(result.user.email).toBe(dto.email);
  });
});

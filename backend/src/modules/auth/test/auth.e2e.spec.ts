import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';

describe('AuthController (integration)', () => {
  let controller: AuthController;

  const mockAuthService = {
    getUsers: jest.fn(),
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockResponse = () => {
    const res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('getAll() returns users', async () => {
    mockAuthService.getUsers.mockResolvedValue([{ id: 'u1', email: 'u1@test.dev' }]);

    const result = await controller.getAll();

    expect(result).toEqual([{ id: 'u1', email: 'u1@test.dev' }]);
  });

  it('register() returns user and sets access-token cookie', async () => {
    const res = mockResponse();
    mockAuthService.register.mockResolvedValue({
      accessToken: 'header.payload.signature',
      user: { id: 'u2', email: 'u2@test.dev' },
    });

    const result = await controller.register(res, {
      email: 'u2@test.dev',
      password: 'Password1!',
    });

    expect(res.cookie).toHaveBeenCalledWith(
      'access-token',
      'header.payload.signature',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
      }),
    );
    expect(result).toEqual({ id: 'u2', email: 'u2@test.dev' });
  });

  it('login() returns user and sets access-token cookie', async () => {
    const res = mockResponse();
    mockAuthService.login.mockResolvedValue({
      accessToken: 'header.payload.signature',
      user: { id: 'u3', email: 'u3@test.dev' },
    });

    const result = await controller.login(
      { email: 'u3@test.dev', password: 'Password1!' },
      res,
    );

    expect(res.cookie).toHaveBeenCalledWith(
      'access-token',
      'header.payload.signature',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
      }),
    );
    expect(result).toEqual({ id: 'u3', email: 'u3@test.dev' });
  });

  it('me() returns current user', async () => {
    const result = await controller.me({ id: 'user-1', email: 'user1@test.dev' });

    expect(result).toEqual({ id: 'user-1', email: 'user1@test.dev' });
  });

  it('logout() clears access-token cookie', async () => {
    const res = mockResponse();

    await controller.logout(res);

    expect(res.clearCookie).toHaveBeenCalledWith('access-token');
  });
});

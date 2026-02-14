import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '@/modules/auth/auth.service';
import { DatabaseService } from '@/modules/database/database.service';
import { Hasher } from '@/shared/lib/hasher.lib';

describe('AuthService', () => {
  let service: AuthService;
  const ARGON_HASH = '$argon2id$v=19$m=65536,t=3,p=4$YWJjZGVmZw$ZmFrZWhhc2g';

  const mockDatabaseService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('getUsers() returns users from database', async () => {
    const users = [{ id: 'u-1', email: 'u1@test.dev' }];
    mockDatabaseService.user.findMany.mockResolvedValue(users);

    const result = await service.getUsers();

    expect(mockDatabaseService.user.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });

  it('generateAuthToken() signs token using config secret + expiry', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'AUTH_JWT_SECRET') return 'secret';
      if (key === 'AUTH_JWT_EXPIRES_IN') return '1h';
      return undefined;
    });

    mockJwtService.sign.mockReturnValue('fake-token');

    const payload = { sub: 'user-id', email: 'a@b.com' };
    const token = await service.generateAuthToken(payload);

    expect(mockJwtService.sign).toHaveBeenCalledWith(
      payload,
      expect.objectContaining({
        secret: 'secret',
        expiresIn: '1h',
      }),
    );
    expect(token).toBe('fake-token');
  });

  it('register() throws when email already exists', async () => {
    const dto = { email: 'test@test.com', password: 'password' };
    mockDatabaseService.user.findUnique.mockResolvedValue({
      id: 'found-user',
      email: dto.email,
    });

    jest.spyOn(Hasher, 'hash').mockResolvedValue(ARGON_HASH);

    await expect(service.register(dto as any)).rejects.toThrow(BadRequestException);
    expect(mockDatabaseService.user.create).not.toHaveBeenCalled();
  });

  it('register() creates user and returns token + user', async () => {
    const dto = { email: 'x@y.com', password: 'password' };
    mockDatabaseService.user.findUnique.mockResolvedValue(null);
    jest.spyOn(Hasher, 'hash').mockResolvedValue(ARGON_HASH);

    const createdUser = {
      id: 'user-id',
      email: dto.email,
      password: ARGON_HASH,
    };
    mockDatabaseService.user.create.mockResolvedValue(createdUser);

    jest.spyOn(service, 'generateAuthToken').mockResolvedValue('fake-token');

    const result = await service.register(dto as any);

    expect(mockDatabaseService.user.create).toHaveBeenCalledWith({
      data: {
        email: dto.email,
        password: ARGON_HASH,
      },
    });
    expect(result).toEqual({ accessToken: 'fake-token', user: createdUser });
  });

  it('login() throws when user not found', async () => {
    mockDatabaseService.user.findUnique.mockResolvedValue(null);
    jest.spyOn(Hasher, 'hash').mockResolvedValue('ignored');

    await expect(
      service.login({ email: 'x@y.com', password: '123' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('login() throws when password is invalid', async () => {
    mockDatabaseService.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'x@y.com',
      password: ARGON_HASH,
    });

    jest.spyOn(Hasher, 'verify').mockResolvedValue(false);

    await expect(
      service.login({ email: 'x@y.com', password: 'wrong' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('login() returns token + user when credentials are valid', async () => {
    const user = {
      id: 'user-id',
      email: 'x@y.com',
      password: ARGON_HASH,
    };
    mockDatabaseService.user.findUnique.mockResolvedValue(user);
    jest.spyOn(Hasher, 'verify').mockResolvedValue(true);
    jest.spyOn(service, 'generateAuthToken').mockResolvedValue('fake-token');

    const result = await service.login({
      email: 'x@y.com',
      password: 'correct',
    } as any);

    expect(result).toEqual({ accessToken: 'fake-token', user });
  });
});

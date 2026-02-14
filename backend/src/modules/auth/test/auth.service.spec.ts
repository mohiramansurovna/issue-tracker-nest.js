import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '@/modules/auth/auth.service';
import { DatabaseService } from '@/modules/database/database.service';
import { Hasher } from '@/shared/lib/hasher.lib';

describe('authService', () => {
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

  describe('generateAuthToken()', () => {
    it('should sign token using secret + expiresIn from config', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AUTH_JWT_SECRET') return 'secret';
        if (key === 'AUTH_JWT_EXPIRES_IN') return '1h';
        return undefined;
      });

      mockJwtService.sign.mockReturnValue('fake-token');

      const payload = { sub: 'user-id', email: 'a@b.com' };
      const token = await service.generateAuthToken(payload as any);

      expect(mockConfigService.get).toHaveBeenCalledWith('AUTH_JWT_SECRET', {
        infer: true,
      });
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'AUTH_JWT_EXPIRES_IN',
        {
          infer: true,
        },
      );

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          secret: 'secret',
          expiresIn: '1h',
        }),
      );

      expect(token).toBe('fake-token');
    });
  });

  describe('register()', () => {
    it('should throw if user found', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'password',
      };

      mockDatabaseService.user.findUnique.mockResolvedValue({
        id: 'foundUser',
        email: dto.email,
      });

      // register() calls Hasher.hash before checking existing user
      jest.spyOn(Hasher, 'hash').mockResolvedValue('hashedpw');

      await expect(service.register(dto as any)).rejects.toThrow(
        BadRequestException,
      );

      expect(Hasher.hash).toHaveBeenCalledWith(dto.password);
      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(mockDatabaseService.user.create).not.toHaveBeenCalled();
    });

    it('should return access token if email is valid', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(null);
      jest.spyOn(Hasher, 'hash').mockResolvedValue(ARGON_HASH);

      mockDatabaseService.user.create.mockResolvedValue({
        id: 'user-id',
        email: 'x@y.com',
        password: ARGON_HASH,
      });

      const tokenSpy = jest
        .spyOn(service, 'generateAuthToken')
        .mockResolvedValue('fake-token' as any);

      const result = await service.register({
        email: 'x@y.com',
        password: 'password',
      } as any);

      expect(mockDatabaseService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'x@y.com',
          password: ARGON_HASH,
        },
      });

      expect(tokenSpy).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'x@y.com',
      });

      expect(result).toBe('fake-token');
    });
  });

  describe('login()', () => {
    it('should throw if user not found', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(null);

      // your service calls Hasher.hash('simple hash') in this branch
      jest.spyOn(Hasher, 'hash').mockResolvedValue('ignored');

      await expect(
        service.login({ email: 'x@y.com', password: '123' } as any),
      ).rejects.toThrow(BadRequestException);

      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'x@y.com' },
      });
    });

    it('should throw if password is invalid', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'x@y.com',
        password: ARGON_HASH,
      });

      jest.spyOn(Hasher, 'verify').mockResolvedValue(false);

      await expect(
        service.login({ email: 'x@y.com', password: 'wrong' } as any),
      ).rejects.toThrow(BadRequestException);

      expect(Hasher.verify).toHaveBeenCalledWith('wrong', ARGON_HASH);
    });

    it('should return access token if credentials are valid', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'x@y.com',
        password: ARGON_HASH,
      });

      jest.spyOn(Hasher, 'verify').mockResolvedValue(true);

      const tokenSpy = jest
        .spyOn(service, 'generateAuthToken')
        .mockResolvedValue('fake-token' as any);

      const result = await service.login({
        email: 'x@y.com',
        password: 'correct',
      } as any);

      expect(tokenSpy).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'x@y.com',
      });
      expect(result).toBe('fake-token');
    });
  });
});

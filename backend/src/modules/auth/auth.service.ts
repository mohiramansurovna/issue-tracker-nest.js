import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { Hasher } from '@/shared/lib/hasher.lib';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@/shared/configs/env.config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthPayload } from '@/modules/auth/auth.types';
import { LoginDto } from '@/modules/auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService<EnvConfig, true>,
    private jwtService: JwtService,
  ) {}

  async getUsers() {
    return this.databaseService.user.findMany();
  }

  async register(dto: RegisterDto) {
    const email = dto.email;
    const password = await Hasher.hash(dto.password);

    const existingUser = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser)
      throw new BadRequestException('There is already account with this email');

    const user = await this.databaseService.user.create({
      data: {
        email,
        password,
      },
    });
    const accessToken = await this.generateAuthToken({
      sub: user.id,
      email: user.email,
    });

    return {accessToken, user};
  }

  async generateAuthToken(payload: AuthPayload) {
    const jwtSecret = this.configService.get('AUTH_JWT_SECRET', {
      infer: true,
    });
    const jwtExpiresIn = this.configService.get('AUTH_JWT_EXPIRES_IN', {
      infer: true,
    });

    return this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    } as JwtSignOptions);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      Hasher.hash('simple hash');
      throw new BadRequestException('Email or password is invalid');
    }
    const isValid = await Hasher.verify(password, user.password);
    if (!isValid) throw new BadRequestException('Email or password is invalid');

    const accessToken=await this.generateAuthToken({
        sub:user.id,
        email:user.email
    })
    return {accessToken, user};
  }
}

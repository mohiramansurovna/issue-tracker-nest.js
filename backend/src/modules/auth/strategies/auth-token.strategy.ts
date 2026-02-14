import { AuthConfig } from '@/shared/configs/auth.config';
import { EnvConfig } from '@/shared/configs/env.config';
import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {  Strategy } from 'passport-jwt';
import { AuthPayload } from '../auth.types';
import { Request } from 'express';

function cookieJwtExtractor(req:Request):string|null{
  return req.cookies?.['access-token'] ?? null;
}

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(
  Strategy,
  AuthConfig.AuthTokenStrategyKey,
) {
  constructor(private readonly configService: ConfigService<EnvConfig, true>) {
    super({
      jwtFromRequest:cookieJwtExtractor,
      secretOrKey: configService.get('AUTH_JWT_SECRET', { infer: true }),
      ignoreExpiration:false
    });
  }

  validate(payload: AuthPayload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}

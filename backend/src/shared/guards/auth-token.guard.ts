import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportGuard } from '@nestjs/passport';
import { AuthConfig } from '@/shared/configs/auth.config';

@Injectable()
export class AuthTokenGuard extends PassportGuard(AuthConfig.AuthTokenStrategyKey) {}

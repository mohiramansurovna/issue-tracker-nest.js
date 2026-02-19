import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module.js';
import { EnvConfig } from './shared/configs/env.config.js';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter.js';
import { ValidationConfig } from './shared/configs/validation.config.js';
import { NestExpressApplication } from '@nestjs/platform-express';

function parseOrigins(value?: string) {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService<EnvConfig, true>);

  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(ValidationConfig);

  const origins = parseOrigins(
    configService.get('CORS_ORIGINS', { infer: true }),
  );
  const corsOrigins =
    origins.length > 0
      ? origins
      : ['http://localhost:5173', 'http://127.0.0.1:5173'];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.set('trust proxy', 1);
  const appPort = configService.get('APP_PORT', { infer: true });
  await app.listen(appPort, '0.0.0.0');
}
bootstrap();

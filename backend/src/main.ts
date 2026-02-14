import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './shared/configs/env.config.js';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter.js';
import { ValidationConfig } from './shared/configs/validation.config.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Issue Tracker API')
    .setDescription(
      'REST API for authentication, issues, and labels. Use "Authorize" with a Bearer JWT token for protected issue routes.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Paste access token returned by /auth/login or /auth/register.',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService<EnvConfig, true>);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(ValidationConfig);

  app.enableCors({
    origin: ['http://127.0.0.1:5173'],
    credentials: true,
  });

  app.use(cookieParser());
  const appPort = configService.get('APP_PORT', { infer: true });
  await app.listen(appPort);
}
bootstrap();

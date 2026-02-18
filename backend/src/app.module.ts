import { Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from '@/shared/configs/env.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { AppController } from '@/app.controller';
import { IssuesModule } from '@/modules/issues/issues.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { LabelsModule } from './modules/labels/labels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    DatabaseModule,
    AuthModule,
    IssuesModule,
    LabelsModule
  ],
  controllers:[AppController]
})
export class AppModule{}

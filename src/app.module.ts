import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './security/auth/auth.module';
import * as Joi from 'joi';
import { AuthGuard } from './security/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [],
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        APP_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        APP_PORT: Joi.number().default(3021),
      }),
    }),
    DatabaseModule,
    AuthModule, // Ensure AuthModule is imported
    UsersModule,
  ],
  controllers: [],
  providers: [{ provide: 'APP_GUARD', useClass: AuthGuard }],
})
export class AppModule {}

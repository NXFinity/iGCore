import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getCorsOrigins } from './configs/cors.config';
declare const module: any;
import { setupSwagger } from './swagger/swagger.function';
import { ConfigService } from '@nestjs/config';

const chalk = require('chalk');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error'],
    snapshot: true,
    cors: {
      origin: getCorsOrigins(process.env.APP_ENV || 'development'),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    },
  });

  const configService = app.get(ConfigService);

  // Determine which database is being used
  const isProduction = configService.get('APP_ENV') === 'production';
  const database = isProduction
    ? configService.get('API_PROD_DB')
    : configService.get('API_DEV_DB');

  // V1 PREFIX FOR ALL ROUTES
  const globalPrefix = 'v1';
  app.setGlobalPrefix(globalPrefix);
  if (process.env.APP_ENV === 'development') {
    // SWAGGER
    setupSwagger(app);
  }

  // PORT
  const port = process.env.APP_PORT || 3021;
  await app.listen(port);

  const serverEnv = process.env.APP_ENV;
  const url =
    serverEnv === 'production'
      ? 'https://api.beamify.online/v1'
      : `http://localhost:${port}/v1`;

  console.log(chalk.greenBright(`Endpoints are running on:\n ${url}`));
  console.log(chalk.redBright(`Using database: ${database}`));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
void bootstrap();

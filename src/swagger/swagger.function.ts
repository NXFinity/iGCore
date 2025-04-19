import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('BEAMIFY ME')
    .setLicense('BEME LICENSE', 'https:/beamify.online/license')
    .setVersion('1.0')
    .setDescription('Nothing interesting here')
    .setContact('BEME Support Team', 'mailto:support@beamify.online', '')
    .setTermsOfService('https://beamify.online/legal/terms')
    .setExternalDoc('BEME Documentation', 'https://docs.beamify.online')
    .addTag('BEME: API', 'Frontend: https://beamify.online')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addSecurityRequirements('bearer')
    .addBearerAuth()
    .addTag('BEME: API', 'Frontend: BEAMIFY.ME')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const extraOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customFavicon: 'https://beamify.online/favicon.ico',
    customSiteTitle: 'BEME: API',
    url: 'https://api.beamify.online/v1',
    servers: [
      {
        url: 'https://api.beamify.online/v1',
        description: 'Production',
      },
      {
        url: 'http://localhost:3021/v1',
        description: 'Development',
      },
    ],
  };
  SwaggerModule.setup('/v1', app, document, extraOptions);
}

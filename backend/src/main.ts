import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Env } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Pack tracker RESTFul API')
    .setDescription(`Aplicación que permite el rastreo de paquetes.`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      apisSorter: 'alpha',
      tagsSorter: 'alpha',
      // operationsSorter: 'alpha',
    },
  });

  const port = configService.get(Env.Port);

  await app.listen(port);

  console.log(`App Pack-tracker is running at ${port} port`);
}
bootstrap();

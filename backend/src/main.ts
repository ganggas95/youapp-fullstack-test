import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { customValidationPipe } from './pipe/validator.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  
  app.setGlobalPrefix("api")

  app.useGlobalPipes(customValidationPipe);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const documentBuilder = new DocumentBuilder()
    .setTitle("YouApp BE test API")
    .setDescription("This is a test API for YouApp BE assessment")
    .setLicense("MIT", "http://opensource.org/licenses/MIT")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/docs', app, document);
  const configServer = app.get(ConfigService);
  await app.listen(configServer.get("APP_PORT", 3100));
}
bootstrap();

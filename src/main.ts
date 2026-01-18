import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  // Set api prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3001;

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

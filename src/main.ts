import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set api prefix
  app.setGlobalPrefix('api/v1');

  app.useLogger(app.get(Logger));

  const port = process.env.PORT ?? 3001;

  await app.listen(port);
}
bootstrap();

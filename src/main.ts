import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set api prefix
  app.setGlobalPrefix('api/v1');

  const logger = app.get(Logger);

  app.useLogger(logger);

  app.useGlobalFilters(new HttpExceptionFilter(logger));

  const port = process.env.PORT ?? 3001;

  await app.listen(port);
}
bootstrap();

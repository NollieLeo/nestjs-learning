import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set api prefix
  app.setGlobalPrefix('api/v1');

  const logger = app.get(Logger);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useLogger(logger);

  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapterHost));

  const port = process.env.PORT ?? 3001;

  await app.listen(port);
}
bootstrap();

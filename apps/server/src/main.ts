import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { TypeormExceptionFilter } from './filters/typeorm-exception.filter';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set api prefix
  app.setGlobalPrefix('api/v1');

  const logger = app.get(Logger);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useLogger(logger);

  // 统一响应体格式拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 越宽泛的过滤器应该越先调用（放在前面）
  app.useGlobalFilters(
    new AllExceptionFilter(logger, httpAdapterHost),
    new TypeormExceptionFilter(logger),
    new EntityNotFoundExceptionFilter(logger),
  );

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('nestjs-learning API')
    .setDescription('The API description for nestjs-learning project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    customSiteTitle: 'NestJS Learning API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
      docExpansion: 'list',
    },
  });

  const port = process.env.PORT ?? 3001;

  await app.listen(port);
}
void bootstrap();

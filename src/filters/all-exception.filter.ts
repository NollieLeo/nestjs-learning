import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';
import { getClientIp } from 'request-ip';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.message
      : exception instanceof Error
        ? exception.message
        : String(exception);

    const exceptionName =
      exception instanceof Error ? exception.name : 'UnknownException';
    const errorMessage =
      exception instanceof Error ? exception.message : 'Internal Server Error';

    const clientIp = getClientIp(request);

    const responseBody = {
      headers: response.getHeaders(),
      query: request.query,
      params: request.params,
      body: request.body as unknown,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ip: clientIp ?? 'unknown',
      message,
      exception: exceptionName,
      error: errorMessage,
    };

    this.logger.error(message, responseBody);

    httpAdapter.reply(response, responseBody, status);
  }
}

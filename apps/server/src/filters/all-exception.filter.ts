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
import { sendFormattedExceptionResponse } from '../utils/exception-response.util';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
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

    sendFormattedExceptionResponse(response, request, this.logger, {
      statusCode: status,
      message,
      exceptionName,
      errorMessage,
    });
  }
}

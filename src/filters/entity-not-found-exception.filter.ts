import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response, Request } from 'express';
import { Logger } from 'nestjs-pino';
import { sendFormattedExceptionResponse } from '../utils/exception-response.util';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    sendFormattedExceptionResponse(response, request, this.logger, {
      statusCode: HttpStatus.NOT_FOUND,
      message: '请求的资源不存在',
      exceptionName: exception.name,
      errorMessage: exception.message,
    });
  }
}

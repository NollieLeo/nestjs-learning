import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 尝试提取更具体的错误信息（如 ValidationPipe 抛出的数组）
    let message = exception.message;
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resObj = exceptionResponse as Record<string, unknown>;
      if (resObj.message) {
        // 如果是数组（通常是类验证器错误），我们用逗号拼接一下
        if (Array.isArray(resObj.message)) {
          message = resObj.message.join(', ');
        } else if (typeof resObj.message === 'string') {
          message = resObj.message;
        }
      }
    }

    // 后端日志记录详细的上下文
    this.logger.error(
      {
        path: request.url,
        method: request.method,
        body: request.body as unknown,
        query: request.query,
        stack: exception.stack,
      },
      message,
    );

    // 统一失败响应格式
    response.status(status).json({
      code: status,
      message,
      error: exception.name,
    });
  }
}

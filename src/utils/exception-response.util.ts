import { Request, Response } from 'express';
import { getClientIp } from 'request-ip';
import { Logger } from 'nestjs-pino';

export interface FormattedExceptionResponse {
  statusCode: number;
  message: string;
  exceptionName: string;
  errorMessage: string;
}

/**
 * 统一构建并发送包含客户端元数据的 HTTP 异常响应
 */
export function sendFormattedExceptionResponse(
  response: Response,
  request: Request,
  logger: Logger,
  exceptionDetails: FormattedExceptionResponse,
) {
  const { statusCode, message, exceptionName, errorMessage } = exceptionDetails;
  const clientIp = getClientIp(request);

  const responseBody = {
    headers: response.getHeaders(),
    query: request.query,
    params: request.params,
    body: request.body as unknown,
    statusCode,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
    ip: clientIp ?? 'unknown',
    message,
    exception: exceptionName,
    error: errorMessage,
  };

  logger.error(message, responseBody);

  response.status(statusCode).json(responseBody);
}

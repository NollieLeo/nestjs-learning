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

  // 日志记录详细信息
  const logDetails = {
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

  logger.error(message, logDetails);

  // 给前端返回精简的统一格式响应
  response.status(statusCode).json({
    code: statusCode, // 失败时 code 等于 http status code
    message,
    error: errorMessage,
  });
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { sendFormattedExceptionResponse } from '../utils/exception-response.util';

@Catch(QueryFailedError)
export class TypeormExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // TypeORM 的底层 driverError 类型扩展
    interface TypeORMError extends Error {
      code?: string;
      errno?: number;
      sqlMessage?: string;
    }

    const err = exception.driverError as TypeORMError;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal database error';

    // 针对 MySQL 的不同错误码进行人性化处理
    if (err) {
      switch (err.code) {
        // [1062] 唯一索引冲突 (Unique Constraint)
        case 'ER_DUP_ENTRY':
          status = HttpStatus.CONFLICT;
          message = '数据已经存在，请勿重复创建';
          break;

        // [1452] 外键约束失败 (Foreign Key Constraint)
        case 'ER_NO_REFERENCED_ROW_2':
          status = HttpStatus.BAD_REQUEST;
          message = '关联的数据不存在，请检查提交的参数 (外键约束失败)';
          break;

        // [1048] 字段不能为空 (Not Null Constraint)
        case 'ER_BAD_NULL_ERROR':
          status = HttpStatus.BAD_REQUEST;
          message = '存在必填字段未提供值';
          break;

        // [1406] 数据过长被截断 (Data Too Long)
        case 'ER_DATA_TOO_LONG':
          status = HttpStatus.BAD_REQUEST;
          message = '输入的数据长度超出了指定范围';
          break;

        // [1364] 缺少默认值 (No Default Value)
        case 'ER_NO_DEFAULT_FOR_FIELD':
          status = HttpStatus.BAD_REQUEST;
          message = '缺少必要的字段数据且该字段没有默认值';
          break;

        // [1264] 超出数值范围 (Out of Range)
        case 'ER_WARN_DATA_OUT_OF_RANGE':
          status = HttpStatus.BAD_REQUEST;
          message = '输入的数值查出了系统允许的边界';
          break;
      }
    }

    sendFormattedExceptionResponse(response, request, this.logger, {
      statusCode: status,
      message,
      exceptionName: exception.name,
      errorMessage: err ? err.message : 'Unknown Database Error',
    });
  }
}

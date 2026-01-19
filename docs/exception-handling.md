# 异常处理

本项目使用全局异常过滤器统一处理所有异常。

## 架构

```
任意异常抛出
    ↓
AllExceptionFilter 捕获
    ↓
记录日志（包含请求详情）
    ↓
返回统一格式响应
```

## 异常过滤器

位置：`src/filters/all-exception.filter.ts`

```typescript
@Catch()  // 捕获所有异常
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 1. 判断异常类型
    const isHttpException = exception instanceof HttpException;
    
    // 2. 获取状态码
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // 3. 记录详细日志
    this.logger.error(message, responseBody);
    
    // 4. 返回响应
    httpAdapter.reply(response, responseBody, status);
  }
}
```

## 响应格式

所有异常返回统一格式：

```json
{
  "statusCode": 500,
  "timestamp": "2024-01-19T15:30:00.000Z",
  "path": "/api/v1/user",
  "method": "POST",
  "ip": "127.0.0.1",
  "message": "Error message",
  "exception": "Error",
  "error": "Detailed error message"
}
```

## 日志记录内容

每个异常日志包含：
- 请求头 (headers)
- 查询参数 (query)
- 路由参数 (params)
- 请求体 (body)
- 客户端 IP
- 请求方法和路径

## 使用方式

### 抛出 HTTP 异常

```typescript
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

// 方式 1：使用内置异常
throw new NotFoundException('User not found');

// 方式 2：自定义状态码
throw new HttpException('Custom error', HttpStatus.BAD_REQUEST);
```

### 常用内置异常

| 异常类 | 状态码 |
|--------|--------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |
| `ConflictException` | 409 |
| `InternalServerErrorException` | 500 |

## 全局注册

在 `main.ts` 中注册：

```typescript
const httpAdapterHost = app.get(HttpAdapterHost);
app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapterHost));
```

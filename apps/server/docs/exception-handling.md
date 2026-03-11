# 异常处理

本项目使用全局异常过滤器统一处理所有异常。

## 架构

```
任意异常抛出
    ↓
按注册顺序倒序检查（TypeormExceptionFilter -> AllExceptionFilter）
    ↓
提取统一上下文（IP、Headers）与格式化 (exception-response.util)
    ↓
记录日志 (Logger)
    ↓
返回统一格式响应
```

## 异常过滤器

| 文件路径                                  | 作用职责                                                                                              |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/filters/all-exception.filter.ts`     | 兜底拦截器，处理所有的 Http 与未知 Error。                                                            |
| `src/filters/typeorm-exception.filter.ts` | 专属拦截器，拦截 `QueryFailedError` 并将底层报错（如 `ER_DUP_ENTRY`）转化成标准的 400/409 HTTP 报错。 |
| `src/utils/exception-response.util.ts`    | 公共的响应格式化工具函数，保证返回给前端的 JSON 结构与控制台日志强一致。                              |

### 核心处理逻辑 (Util 挂载)

通过提取公共的 `sendFormattedExceptionResponse`，两个过滤器的最后一步处理被完美统一：

```typescript
import { sendFormattedExceptionResponse } from '../utils/exception-response.util';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 1. 判断并分配 Http 状态码
    // 2. 统一调用工具发送 Response
    sendFormattedExceptionResponse(response, request, this.logger, {
      statusCode: status,
      message,
      exceptionName,
      errorMessage,
    });
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

| 异常类                         | 状态码 |
| ------------------------------ | ------ |
| `BadRequestException`          | 400    |
| `UnauthorizedException`        | 401    |
| `ForbiddenException`           | 403    |
| `NotFoundException`            | 404    |
| `ConflictException`            | 409    |
| `InternalServerErrorException` | 500    |

## 全局注册

在 `main.ts` 中注册：

```typescript
import { AllExceptionFilter } from './filters/all-exception.filter';
import { TypeormExceptionFilter } from './filters/typeorm-exception.filter';

// 越宽泛的过滤器应该越先调用（放在前面注册，置后命中）
app.useGlobalFilters(
  new AllExceptionFilter(logger, httpAdapterHost),
  new TypeormExceptionFilter(logger),
);
```

## 数据库异常拦截最佳实践

得益于 `TypeormExceptionFilter` 的存在，对于数据库落库时常见的“唯一约束冲突（如用户名已被注册）”不需要在 Service 层写防御性查询：

**❌ 不推荐（冗余查询降低性能）**

```typescript
const exist = await repo.findOne({ username });
if (exist) throw new ConflictException('已存在');
repo.save(user);
```

**✅ 推荐范式（依赖抛错拦截）**

```typescript
// 直接基于完整 DTO 保存，若 MySQL 抛出 ER_DUP_ENTRY，
// 会由 TypeormExceptionFilter 自动捕获并转换回 409 Conflict 返回前端。
repo.save(user);
```

# 日志系统

本项目使用 `nestjs-pino` 实现结构化日志。

## 技术选型

| 特性        | Pino        | Winston      |
| ----------- | ----------- | ------------ |
| 性能        | ⚡ 极快     | 一般         |
| 输出格式    | JSON        | 多种         |
| NestJS 集成 | nestjs-pino | nest-winston |

选择 Pino 的原因：**高性能 + 结构化 JSON 日志**

## 配置

位置：`src/logs/logs.module.ts`

```typescript
LoggerModule.forRootAsync({
  useFactory: () => ({
    pinoHttp: {
      transport:
        process.env.NODE_ENV === 'development'
          ? { target: 'pino-pretty' } // 开发：彩色输出
          : { target: 'pino-roll' }, // 生产：文件滚动
    },
  }),
});
```

## 环境差异

### 开发环境

使用 `pino-pretty` 格式化输出：

```
[23:10:40.510] INFO (42891): request completed
    req: { "method": "GET", "url": "/api/v1/user" }
    res: { "statusCode": 200 }
    responseTime: 15
```

### 生产环境

使用 `pino-roll` 写入文件：

- 路径：`logs/log.txt`
- 滚动策略：每日 + 10MB 大小限制
- 自动创建目录

## 使用方式

### 在控制器/服务中注入

```typescript
import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  constructor(private readonly logger: Logger) {}

  @Get()
  getUsers() {
    this.logger.log('Fetching users');
    // ...
  }
}
```

### 日志级别

```typescript
this.logger.log('Info message');
this.logger.warn('Warning message');
this.logger.error('Error message');
this.logger.debug('Debug message');
this.logger.verbose('Verbose message');
```

## 自动记录内容

`pino-http` 自动记录每个 HTTP 请求：

- 请求方法、URL
- 响应状态码
- 响应时间
- 请求/响应头
- 客户端 IP

## 与异常过滤器集成

`AllExceptionFilter` 使用 Logger 记录所有异常：

```typescript
this.logger.error(message, {
  statusCode,
  path,
  method,
  ip,
  headers,
  query,
  body,
});
```

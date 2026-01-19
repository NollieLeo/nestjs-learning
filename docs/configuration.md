# 环境配置

本项目使用 `@nestjs/config` + `dotenv` 管理环境变量。

## 配置文件

```
.env                    # 公共配置（默认值）
.env.development        # 开发环境
.env.production         # 生产环境
```

## 加载优先级

```
.env.{NODE_ENV} > .env
```

开发时 `NODE_ENV=development`，先加载 `.env.development`，再加载 `.env` 作为回退。

## 环境变量列表

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NODE_ENV` | 运行环境 | development |
| `PORT` | 服务端口 | 3001 |
| `DB_TYPE` | 数据库类型 | mysql |
| `DB_HOST` | 数据库地址 | - |
| `DB_PORT` | 数据库端口 | 3306 |
| `DB_USERNAME` | 数据库用户名 | - |
| `DB_PASSWORD` | 数据库密码 | - |
| `DB_NAME` | 数据库名称 | - |
| `DB_SYNC` | 自动同步实体 | false |

## 验证

使用 Joi 验证环境变量：

```typescript
// app.module.ts
ConfigModule.forRoot({
  validationSchema: Joi.object({
    DB_HOST: Joi.string().ip(),
    DB_USERNAME: Joi.string().required(),
    // ...
  }),
});
```

启动时缺少必填变量会报错。

## 使用方式

### 方式 1：注入 ConfigService

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    const dbHost = this.configService.get('DB_HOST');
    const port = this.configService.get<number>('DB_PORT');
  }
}
```

### 方式 2：直接使用 process.env

```typescript
const isDev = process.env.NODE_ENV === 'development';
```

**推荐使用 ConfigService**，因为：
- 类型安全
- 支持默认值
- 便于测试和 mock

## 示例 .env 文件

```bash
# .env.development
NODE_ENV=development
PORT=3001

# Database
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=my_database
DB_SYNC=true
```

## 注意事项

> ⚠️ **生产环境务必设置 `DB_SYNC=false`**

> ⚠️ **.env 文件不应提交到 Git**，添加到 `.gitignore`

# NestJS 快速入门指南

本文档介绍本项目的架构和核心概念，帮助 NestJS 新手快速上手。

## 项目结构

```
src/
├── main.ts              # 应用入口
├── app.module.ts        # 根模块
├── config/              # 配置模块
│   └── database.config.ts
├── user/                # 用户模块（示例 CRUD）
│   ├── user.module.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.entity.ts
├── logs/                # 日志模块
├── filters/             # 异常过滤器
└── migrations/          # 数据库迁移
```

## 核心概念

### 1. 模块 (Module)

模块是 NestJS 的基本组织单元，用于组织相关功能。

```typescript
@Module({
  imports: [...],      // 导入其他模块
  controllers: [...],  // 注册控制器
  providers: [...],    // 注册服务
  exports: [...],      // 导出给其他模块使用
})
export class UserModule {}
```

**本项目模块**：

- `AppModule` - 根模块，导入所有子模块
- `UserModule` - 用户 CRUD
- `LogsModule` - 日志记录
- `RangeModule` - 范围查询示例

### 2. 控制器 (Controller)

处理 HTTP 请求，定义路由。

```typescript
@Controller('user') // 路由前缀 /api/v1/user
export class UserController {
  @Get() // GET /api/v1/user
  getUsers() {}

  @Post() // POST /api/v1/user
  addUser() {}

  @Put(':id') // PUT /api/v1/user/:id
  updateUser() {}

  @Delete(':id') // DELETE /api/v1/user/:id
  deleteUser() {}
}
```

### 3. 服务 (Service/Provider)

处理业务逻辑，可被多个控制器复用。

```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }
}
```

### 4. 实体 (Entity)

TypeORM 实体，映射数据库表。

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;
}
```

### 5. 依赖注入 (DI)

NestJS 自动管理依赖关系：

```typescript
// 1. 在 providers 中注册
@Module({
  providers: [UserService],
})

// 2. 在构造函数中注入
constructor(private readonly userService: UserService) {}
```

## 请求生命周期

```
HTTP 请求
    ↓
中间件 (Middleware)
    ↓
守卫 (Guard) - 权限检查
    ↓
拦截器 (Interceptor) - 前置处理
    ↓
管道 (Pipe) - 数据验证/转换
    ↓
控制器 (Controller)
    ↓
服务 (Service)
    ↓
拦截器 (Interceptor) - 后置处理
    ↓
异常过滤器 (Exception Filter) - 错误处理
    ↓
HTTP 响应
```

## 常用装饰器

| 装饰器                                  | 用途             |
| --------------------------------------- | ---------------- |
| `@Controller()`                         | 定义控制器       |
| `@Get()` `@Post()` `@Put()` `@Delete()` | HTTP 方法        |
| `@Param()`                              | 获取路由参数     |
| `@Query()`                              | 获取查询参数     |
| `@Body()`                               | 获取请求体       |
| `@Injectable()`                         | 标记可注入的服务 |
| `@Module()`                             | 定义模块         |

## 启动应用

```bash
# 开发模式（热重载）
pnpm run start:dev

# 生产模式
pnpm run start:prod
```

## API 端点

本项目默认前缀：`/api/v1`

| 方法   | 路径                     | 说明         |
| ------ | ------------------------ | ------------ |
| GET    | /api/v1/user             | 获取所有用户 |
| POST   | /api/v1/user             | 创建用户     |
| PUT    | /api/v1/user/:id         | 更新用户     |
| DELETE | /api/v1/user/:id         | 删除用户     |
| GET    | /api/v1/user/:id/profile | 获取用户详情 |
| GET    | /api/v1/logs             | 获取日志列表 |
| GET    | /api/v1/logs/stats       | 日志统计     |

## 下一步

- [数据库迁移指南](./database-migration.md)
- [数据库架构设计](./database-architecture.md)
- [异常处理说明](./exception-handling.md)
- [日志系统说明](./logging.md)

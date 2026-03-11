# TypeORM 迁移集成架构设计

本文档详细说明了 TypeORM 迁移功能的架构设计思路和技术决策。

## 背景问题

### `synchronize: true` 的风险

TypeORM 的 `synchronize` 选项会在应用启动时自动将实体定义同步到数据库：

| 实体变化 | 数据库操作                | 风险                |
| -------- | ------------------------- | ------------------- |
| 新增字段 | `ALTER TABLE ADD COLUMN`  | ✅ 安全             |
| 删除字段 | `ALTER TABLE DROP COLUMN` | ❌ **数据永久丢失** |
| 修改类型 | 重建列                    | ❌ **数据永久丢失** |

**生产事故示例**：

```
1. 开发者删除了 User.age 字段
2. 部署到生产，应用自动重启
3. synchronize: true 执行 DROP COLUMN age
4. 所有用户的年龄数据永久丢失
```

## 架构设计

### 文件结构

```
src/
├── config/
│   └── database.config.ts   # 公共数据库配置
├── migrations/              # 迁移文件目录
├── data-source.ts           # TypeORM CLI 配置
└── app.module.ts            # NestJS 模块配置
```

### 为什么需要两个配置入口？

| 运行环境    | 配置文件                                | 特点                                    |
| ----------- | --------------------------------------- | --------------------------------------- |
| NestJS 应用 | `app.module.ts` → `database.config.ts`  | 在 NestJS 容器内运行，有 `ConfigModule` |
| TypeORM CLI | `data-source.ts` → `database.config.ts` | 独立 Node.js 脚本，无 NestJS 容器       |

```
┌─────────────────────────────────────────────────────────────┐
│                    database.config.ts                       │
│                   (公共配置工厂)                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│   app.module.ts     │    │        data-source.ts           │
│  (NestJS 运行时)     │    │       (CLI 迁移命令)            │
│                     │    │                                 │
│ • ConfigModule 已    │    │ • 必须自己加载 .env              │
│   加载环境变量       │    │ • dotenv.config() 在 import 前   │
│ • autoLoadEntities  │    │ • synchronize: false (强制)     │
└─────────────────────┘    └─────────────────────────────────┘
```

### 关键设计决策

#### 1. 环境变量加载顺序

`data-source.ts` 中 `dotenv.config()` **必须**在 `import` 配置之前：

```typescript
// ✅ 正确顺序
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // 先加载

import { getDatabaseConfig } from './config/database.config'; // 后导入
```

```typescript
// ❌ 错误顺序
import { getDatabaseConfig } from './config/database.config'; // 此时 process.env 为空
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
```

#### 2. CLI 强制禁用 synchronize

```typescript
// data-source.ts
export default new DataSource({
  ...getDatabaseConfig(),
  synchronize: false, // ⚠️ 永远不应该自动同步
});
```

CLI 用于执行迁移，如果开启 `synchronize`，会在迁移前自动同步，破坏迁移的可控性。

#### 3. autoLoadEntities 替代 glob 模式

```typescript
// ❌ 旧方式：glob 模式
entities: [__dirname + '/**/*.entity{.ts,.js}'];

// ✅ 新方式：自动加载
autoLoadEntities: true; // 自动收集 forFeature() 注册的实体
```

**优势**：

- 避免路径解析问题（特别是在打包后）
- 与 `TypeOrmModule.forFeature([Entity])` 保持一致
- 更可靠的实体发现机制

## 迁移工作流对比

### 无迁移（危险）

```
修改实体 → 启动应用 → 自动同步 → 可能丢失数据
```

### 有迁移（安全）

```
修改实体
    ↓
pnpm migration:generate --name=Description
    ↓
生成迁移文件（可审查的 SQL）
    ↓
代码审查 / Git 提交
    ↓
pnpm migration:run（部署时执行）
    ↓
出问题？pnpm migration:revert（可回滚）
```

## 技术栈选择理由

| 选择                  | 理由                                           |
| --------------------- | ---------------------------------------------- |
| TypeORM Migration     | NestJS 官方推荐，与 `@nestjs/typeorm` 深度集成 |
| `ts-node` 执行脚本    | 直接运行 TypeScript，无需编译                  |
| 独立 `data-source.ts` | TypeORM CLI 要求，无法绕过                     |
| 抽取公共配置          | 避免配置重复，单一真相来源                     |

# 数据库迁移指南

本文档介绍如何在项目中使用 TypeORM 数据库迁移功能。

## 为什么需要迁移？

| 方式                | 开发环境    | 生产环境            |
| ------------------- | ----------- | ------------------- |
| `synchronize: true` | ✅ 快速迭代 | ❌ 可能导致数据丢失 |
| Migration 迁移      | ✅ 版本控制 | ✅ 安全可控         |

## 快速开始

### 1. 生成迁移文件

当你修改了实体（Entity）后，运行以下命令自动生成迁移：

```bash
pnpm migration:generate --name=DescriptiveName
```

例如：

```bash
pnpm migration:generate --name=AddUserAvatar
```

这会在 `src/migrations/` 目录下生成类似 `1705678901234-AddUserAvatar.ts` 的文件。

### 2. 执行迁移

```bash
pnpm migration:run
```

### 3. 回滚迁移

如果需要撤销最近一次迁移：

```bash
pnpm migration:revert
```

### 4. 查看迁移状态

```bash
pnpm migration:show
```

## 可用命令

| 命令                                  | 说明                         |
| ------------------------------------- | ---------------------------- |
| `pnpm migration:generate --name=Name` | 根据实体变化自动生成迁移     |
| `pnpm migration:create --name=Name`   | 创建空白迁移文件（手动编写） |
| `pnpm migration:run`                  | 执行所有待执行的迁移         |
| `pnpm migration:revert`               | 回滚最后一次迁移             |
| `pnpm migration:show`                 | 显示迁移状态                 |

## 迁移文件示例

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAvatar1705678901234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE user ADD COLUMN avatar VARCHAR(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE user DROP COLUMN avatar
    `);
  }
}
```

## 推荐工作流

### 开发阶段

1. 修改 Entity 文件
2. 运行 `pnpm migration:generate --name=YourMigrationName`
3. 检查生成的迁移文件
4. 运行 `pnpm migration:run` 应用变更
5. 提交迁移文件到 Git

### 部署阶段

1. 代码部署后，运行 `pnpm migration:run`
2. 如果出现问题，运行 `pnpm migration:revert` 回滚

## 注意事项

> ⚠️ **警告**：生产环境请确保 `synchronize: false`

- 迁移文件一旦执行并提交，**不要修改**，而是创建新的迁移来修正
- 在执行迁移前，建议**备份数据库**
- 迁移文件需要提交到版本控制（Git）

## 配置文件说明

| 文件                            | 用途                             |
| ------------------------------- | -------------------------------- |
| `src/config/database.config.ts` | 数据库配置工厂（公共配置）       |
| `src/data-source.ts`            | TypeORM CLI 配置（迁移命令使用） |
| `src/migrations/`               | 迁移文件目录                     |

import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// ⚠️ 必须先加载环境变量，再导入配置
// 因为 CLI 独立运行，不经过 NestJS 的 ConfigModule
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFilePath });
dotenv.config({ path: '.env' });

// 环境变量加载后，再导入配置
import { getDatabaseConfig } from './config/database.config';

/**
 * TypeORM CLI 专用配置
 * 用于迁移命令：migration:generate, migration:run, migration:revert 等
 */
export default new DataSource({
  ...getDatabaseConfig(),
  synchronize: false, // ⚠️ CLI 永远不应该自动同步
  logging: true,
} as DataSourceOptions);

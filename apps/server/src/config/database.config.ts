import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

/**
 * 获取数据库配置
 * 供 app.module.ts 和 data-source.ts 共用
 */
export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type:
    (process.env.DB_TYPE as 'mysql' | 'postgres' | 'sqlite' | 'mssql') ||
    'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.NODE_ENV === 'development' ? true : ['error'],
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
});

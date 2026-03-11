import { Module } from '@nestjs/common';
import { RangeModule } from './range/range.module';
import { UserModule } from './user/user.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.valid()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_SYNC: Joi.boolean().default(false),
        DB_HOST: Joi.string().ip(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_TYPE: Joi.string()
          .valid('mysql', 'postgres', 'sqlite', 'mssql')
          .default('mysql'),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (): TypeOrmModuleOptions => ({
        ...getDatabaseConfig(),
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UserModule,
    RangeModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

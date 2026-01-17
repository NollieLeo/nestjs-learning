import { Module } from '@nestjs/common';
import { RangeModule } from './range/range.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

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
        DB_PORT: Joi.number().default(3090),
        DB_SYNC: Joi.boolean().default(false),
        DB_HOST: Joi.string().ip(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_TYPE: Joi.string()
          .valid('mysql', 'postgres', 'sqlite', 'mssql')
          .default('mysql'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          synchronize: configService.get('DB_SYNC'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          logging: process.env.NODE_ENV === 'development' ? true : ['error'],
        }) as TypeOrmModuleOptions,
    }),
    UserModule,
    RangeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

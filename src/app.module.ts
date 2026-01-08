import { Module } from '@nestjs/common';
import { RangeModule } from './range/range.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';

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
        DB_PROT: Joi.number().default(3306),
      }),
    }),
    UserModule,
    RangeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

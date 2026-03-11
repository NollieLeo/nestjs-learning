import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';

const pinoLogger = LoggerModule.forRootAsync({
  useFactory: () => ({
    pinoHttp: {
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            }
          : {
              target: 'pino-roll',
              options: {
                file: join('logs', 'log.txt'),
                frequency: 'daily',
                size: '10m',
                mkdir: true,
              },
            },
    },
  }),
});

@Module({
  imports: [TypeOrmModule.forFeature([Logs]), pinoLogger],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}

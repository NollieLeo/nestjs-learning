import { Module } from '@nestjs/common';
import { RangeController } from './range.controller';
import { RangeService } from './range.service';

/**
 * 范围模块
 * 提供数字范围生成功能
 */
@Module({
  controllers: [RangeController],
  providers: [RangeService],
})
export class RangeModule {}

import { Controller, Get, Query } from '@nestjs/common';
import { RangeService } from './range.service';
import { Logger } from 'nestjs-pino';

/**
 * 范围控制器
 * 提供生成数字范围的功能
 */
@Controller('range')
export class RangeController {
  constructor(
    private readonly rangeService: RangeService,
    private readonly loggger: Logger,
  ) {
    this.loggger.log('RangeController init');
  }

  /**
   * 获取纯数字列表
   * 从 0 一直递增到给定的 num-1
   * @param num 生成的数字最大条目个数
   */
  @Get()
  getRange(@Query('num') num: string): number[] {
    return this.rangeService.getRange(+num);
  }
}

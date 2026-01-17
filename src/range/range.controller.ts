import { Controller, Get, Query } from '@nestjs/common';
import { RangeService } from './range.service';

/**
 * 范围控制器
 * 提供生成数字范围的功能
 */
@Controller('range')
export class RangeController {
  constructor(private readonly rangeService: RangeService) {}

  /**
   * 获取从 0 到 num-1 的数字数组
   * GET /range?num=10
   * @param num - 生成的数字个数
   * @returns 数字数组 [0, 1, 2, ..., num-1]
   */
  @Get()
  getRange(@Query('num') num: string): number[] {
    return this.rangeService.getRange(+num);
  }
}

import { Injectable } from '@nestjs/common';

/**
 * 范围服务
 * 提供生成数字范围的业务逻辑
 */
@Injectable()
export class RangeService {
  /**
   * 生成从 0 到 num-1 的数字数组
   * @param num - 数组长度
   * @returns 数字数组
   * @example getRange(5) => [0, 1, 2, 3, 4]
   */
  getRange(num: number): number[] {
    return Array.from({ length: num }, (_, i) => i);
  }
}

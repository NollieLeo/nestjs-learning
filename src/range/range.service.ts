import { Injectable } from '@nestjs/common';

@Injectable()
export class RangeService {
  getRange(num: number): number[] {
    return Array.from({ length: num }, (_, i) => i);
  }
}

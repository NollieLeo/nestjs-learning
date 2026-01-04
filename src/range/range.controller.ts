import { Controller, Get, Param } from '@nestjs/common';
import { RangeService } from './range.service';

@Controller()
export class RangeController {
  constructor(private readonly rangeService: RangeService) {}

  @Get('range/:num')
  getRange(@Param('num') num: string): number[] {
    return this.rangeService.getRange(+num);
  }
}

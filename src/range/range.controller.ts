import { Controller, Get, Query } from '@nestjs/common';
import { RangeService } from './range.service';

@Controller('range')
export class RangeController {
  constructor(private readonly rangeService: RangeService) {}

  @Get()
  getRange(@Query('num') num: string): number[] {
    return this.rangeService.getRange(+num);
  }
}

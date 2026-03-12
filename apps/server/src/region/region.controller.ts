import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RegionService } from './region.service';

@ApiTags('行政区划')
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  @ApiOperation({ summary: '获取省级行政区划列表或按 code 列表查询' })
  @ApiQuery({
    name: 'codes',
    required: false,
    type: [String],
    description: '区划 code 数组，用于回显',
  })
  findAll(@Query('codes') codes?: string | string[]) {
    if (codes) {
      const codesArray = Array.isArray(codes) ? codes : [codes];
      return this.regionService.getRegionsByCodes(codesArray);
    }
    return this.regionService.getProvinces();
  }

  @Get(':parentCode')
  @ApiOperation({ summary: '根据父级 Code 获取下级行政区划列表' })
  findByParentCode(@Param('parentCode') parentCode: string) {
    return this.regionService.getChildrenByParentCode(parentCode);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsQueryDto } from './dto/logs-query.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  /**
   * 查询日志列表
   * 支持筛选、排序、分页
   */
  @Get()
  getLogs(@Query() query: LogsQueryDto) {
    return this.logsService.findAll(query);
  }

  /**
   * 获取日志统计信息
   */
  @Get('stats')
  getStats(@Query('userId') userId?: number) {
    return this.logsService.getStats(userId ? Number(userId) : undefined);
  }

  /**
   * 按用户分组统计日志
   */
  @Get('stats/by-user')
  getStatsByUser() {
    return this.logsService.getStatsByUser();
  }

  /**
   * 获取单条日志详情
   */
  @Get(':id')
  getLogById(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }
}

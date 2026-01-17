import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogsService, LogQueryOptions } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  /**
   * 查询日志列表（支持筛选、排序、分页）
   * GET /logs?userId=1&status=success&orderBy=result&order=DESC&page=1&limit=10
   */
  @Get()
  getLogs(
    @Query('userId') userId?: number,
    @Query('status') status?: 'success' | 'fail',
    @Query('orderBy') orderBy?: LogQueryOptions['orderBy'],
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.logsService.findAll({
      userId: userId ? Number(userId) : undefined,
      status,
      orderBy,
      order,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  /**
   * 获取日志统计信息
   * GET /logs/stats?userId=1
   */
  @Get('stats')
  getStats(@Query('userId') userId?: number) {
    return this.logsService.getStats(userId ? Number(userId) : undefined);
  }

  /**
   * 按用户分组统计日志
   * GET /logs/stats/by-user
   */
  @Get('stats/by-user')
  getStatsByUser() {
    return this.logsService.getStatsByUser();
  }

  /**
   * 获取单条日志详情
   * GET /logs/:id
   */
  @Get(':id')
  getLogById(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }
}

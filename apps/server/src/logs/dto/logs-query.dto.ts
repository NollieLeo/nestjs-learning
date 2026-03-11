import { LogQueryOptions } from '../logs.service';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

/**
 * 日志查询参数 DTO
 */
export class LogsQueryDto implements LogQueryOptions {
  /**
   * 用户 ID
   * @example 1
   */
  @IsOptional()
  @IsInt()
  userId?: number;

  /**
   * 状态过滤
   * @example success
   */
  @IsOptional()
  @IsEnum(['success', 'fail'])
  @ApiPropertyOptional({ enum: ['success', 'fail'] })
  status?: 'success' | 'fail';

  /**
   * 排序字段
   * @example result
   */
  @IsOptional()
  @IsEnum(['id', 'result', 'method', 'path'])
  @ApiPropertyOptional({ enum: ['id', 'result', 'method', 'path'] })
  orderBy?: 'id' | 'result' | 'method' | 'path';

  /**
   * 排序方向
   * @example DESC
   */
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  order?: 'ASC' | 'DESC';

  /**
   * 页码
   * @example 1
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  /**
   * 每页条数
   * @example 10
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

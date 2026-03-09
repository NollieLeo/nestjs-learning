import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

/**
 * 用户列表查询参数 DTO
 */
export class UserQueryDto {
  /**
   * 搜索关键字（支持模糊匹配用户名或精确匹配ID）
   * @example admin
   */
  @IsOptional()
  @IsString()
  keyword?: string;

  /**
   * 按角色ID过滤
   * @example 1
   */
  @IsOptional()
  @IsInt()
  role?: number;

  /**
   * 排序字段
   * @example id
   */
  @IsOptional()
  @IsEnum(['id', 'username'])
  @ApiPropertyOptional({ enum: ['id', 'username'] })
  orderBy?: 'id' | 'username';

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

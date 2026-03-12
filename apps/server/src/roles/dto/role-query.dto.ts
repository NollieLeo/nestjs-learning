import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { RoleQuery } from '@nestjs-learning/shared';

export class RoleQueryDto implements RoleQuery {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

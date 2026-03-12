import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PASSWORD_MIN_LENGTH, RegisterRequest } from '@nestjs-learning/shared';
import { Type } from 'class-transformer';

class RoleIdDto {
  @IsOptional()
  id?: number;
}

export class ProfileDto {
  @IsOptional()
  gender?: number;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  address?: string;
}

/**
 * 创建用户 DTO
 */
export class CreateUserDto implements RegisterRequest {
  /**
   * 用户名
   * @example wengkaimin
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * 密码
   * @example 123456
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoleIdDto)
  roles?: RoleIdDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile?: ProfileDto;
}

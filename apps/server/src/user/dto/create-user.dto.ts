import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  Length,
} from 'class-validator';
import {
  PASSWORD_MIN_LENGTH,
  RegisterRequest,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from '@nestjs-learning/shared';
import { Type, Transform } from 'class-transformer';
import { trimString } from '../../utils/transformer.util';

class RoleIdDto {
  @IsOptional()
  id?: number;
}

export class AddressInfoDto {
  @IsOptional()
  @IsString()
  provinceCode?: string;

  @IsOptional()
  @IsString()
  provinceName?: string;

  @IsOptional()
  @IsString()
  cityCode?: string;

  @IsOptional()
  @IsString()
  cityName?: string;

  @IsOptional()
  @IsString()
  districtCode?: string;

  @IsOptional()
  @IsString()
  districtName?: string;

  @IsOptional()
  @IsString()
  detailAddress?: string;
}

export class ProfileDto {
  @IsOptional()
  gender?: number;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInfoDto)
  addressInfo?: AddressInfoDto;
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
  @Transform(trimString)
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: `用户名长度必须在 ${USERNAME_MIN_LENGTH} 到 ${USERNAME_MAX_LENGTH} 个字符之间`,
  })
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

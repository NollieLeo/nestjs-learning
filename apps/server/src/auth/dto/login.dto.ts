import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PASSWORD_MIN_LENGTH, LoginRequest } from '@nestjs-learning/shared';
import { Transform } from 'class-transformer';
import { trimString } from '../../utils/transformer.util';

/**
 * 登录 DTO
 */
export class LoginDto implements LoginRequest {
  /**
   * 用户名
   * @example wengkaimin
   */
  @IsString()
  @IsNotEmpty()
  @Transform(trimString)
  username: string;

  /**
   * 密码
   * @example 123456
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;
}

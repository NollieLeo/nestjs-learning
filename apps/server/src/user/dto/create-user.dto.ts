import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PASSWORD_MIN_LENGTH, RegisterRequest } from '@nestjs-learning/shared';

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
}

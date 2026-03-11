import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * 创建用户 DTO
 */
export class CreateUserDto {
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
  @MinLength(6)
  password: string;
}

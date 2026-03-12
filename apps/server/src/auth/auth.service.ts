import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   */
  async register(dto: CreateUserDto) {
    // userService.create 内部已做了密码加密，直接传给它即可
    return this.userService.create(dto);
  }

  /**
   * 用户登录
   * 校验用户名密码，签发 JWT
   */
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);
    const roles = user.roles ? user.roles.map((r) => r.name) : [];
    const payload = { sub: user.id, username: user.username, roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * 校验用户身份
   */
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username, true);
    if (!user) {
      throw new BadRequestException('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('用户名或密码错误');
    }

    return user;
  }

  /**
   * 修改密码
   */
  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.userService.findUserByIdWithPassword(userId);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (!dto.oldPassword) {
      throw new BadRequestException('请提供旧密码');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('旧密码错误');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.userService.updatePasswordRaw(userId, hashedNewPassword);

    return { success: true };
  }
}

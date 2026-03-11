import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   * 加密密码后创建用户
   */
  async register(dto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    return this.userService.create({
      ...dto,
      password: hashedPassword,
    });
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
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return user;
  }
}

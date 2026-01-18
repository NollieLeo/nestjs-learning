import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { User } from './user.entity';

/**
 * 用户控制器
 * 处理用户相关的 HTTP 请求
 */
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('UserController init');
  }

  /**
   * 获取所有用户列表
   * GET /user
   */
  @Get()
  getUsers() {
    this.logger.log('success to get users');
    return this.userService.findAll();
  }

  /**
   * 创建新用户
   * POST /user
   * @param user - 用户信息（用户名、密码）
   */
  @Post()
  addUser(@Body() user: Pick<User, 'username' | 'password'>) {
    return this.userService.create(user);
  }

  /**
   * 更新用户信息
   * PUT /user/:id
   * @param id - 用户 ID
   * @param user - 要更新的用户信息
   */
  @Put(':id')
  updateUser(
    @Param('id') id: number,
    @Body() user: Partial<Pick<User, 'username' | 'password'>>,
  ) {
    return this.userService.update(id, user);
  }

  /**
   * 删除用户
   * DELETE /user/:id
   * @param id - 用户 ID
   */
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  /**
   * 获取用户详情（包含 Profile）
   * GET /user/:id/profile
   * @param id - 用户 ID
   */
  @Get(':id/profile')
  getUserProfile(@Param('id') id: number) {
    return this.userService.findUserProfile(id);
  }
}

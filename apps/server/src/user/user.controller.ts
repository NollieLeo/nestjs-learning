import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { Logger } from 'nestjs-pino';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@nestjs-learning/shared';

/**
 * 用户控制器
 * 处理用户相关的 HTTP 请求
 */
@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('UserController init');
  }

  /**
   * 获取用户列表（支持分页、排序、搜索）
   * @param query 查询参数
   */
  @Get()
  getUsers(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }

  /**
   * 根据ID获取特定用户详细信息
   * @param id 用户 ID
   */
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  /**
   * 创建新用户
   * @param user 用户信息（包含用户名、密码）
   */
  @Post()
  addUser(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  /**
   * 更新用户信息
   * @param id 用户 ID
   * @param user 要更新的用户部分信息
   */
  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    return this.userService.update(id, user);
  }

  /**
   * 根据ID删除用户
   * @param id 用户 ID
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  /**
   * 获取用户详情（包含关联 Profile 资料表内容）
   * @param id 用户 ID
   */
  @Get(':id/profile')
  getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserProfile(id);
  }
}

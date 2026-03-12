import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * 用户注册
   */
  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  /**
   * 用户登录
   */
  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * 获取当前用户信息
   */
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: { id: number; username: string } }) {
    return this.userService.findUserProfile(req.user.id);
  }

  /**
   * 更新当前用户资料
   */
  @ApiOperation({ summary: '更新当前用户资料' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req: { user: { id: number } },
    @Body() dto: UpdateMyProfileDto,
  ) {
    // We can cast here safely or add an updateMyProfile in userService, using UpdateUserDto structure
    return this.userService.update(req.user.id, dto as UpdateUserDto);
  }

  /**
   * 修改当前用户密码
   */
  @ApiOperation({ summary: '修改当前用户密码' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('password')
  async updatePassword(
    @Request() req: { user: { id: number } },
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(req.user.id, dto);
  }
}

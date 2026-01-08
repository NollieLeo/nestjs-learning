import { Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getUsers() {
    console.log('DB_PORT', this.configService.get('DB_PORT'));
    return this.userService.getUsers();
  }

  @Post()
  addUser() {
    return this.userService.addUser();
  }
}

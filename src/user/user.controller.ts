import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getUsers() {
    console.log('DB_PORT', this.configService.get('DB_PORT'));
    return this.userService.findAll();
  }

  @Post()
  addUser(@Body() user: Pick<User, 'username' | 'password'>) {
    return this.userService.create(user);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: number,
    @Body() user: Partial<Pick<User, 'username' | 'password'>>,
  ) {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}

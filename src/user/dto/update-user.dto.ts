import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * 更新用户 DTO
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}

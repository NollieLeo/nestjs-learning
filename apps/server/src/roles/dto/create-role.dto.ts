import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRoleRequest } from '@nestjs-learning/shared';

export class CreateRoleDto implements CreateRoleRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}

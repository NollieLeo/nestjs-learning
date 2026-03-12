import { IsString, MinLength } from 'class-validator';
import {
  PASSWORD_MIN_LENGTH,
  UpdatePasswordRequest,
} from '@nestjs-learning/shared';

export class UpdatePasswordDto implements UpdatePasswordRequest {
  @IsString()
  oldPassword?: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  newPassword: string;
}

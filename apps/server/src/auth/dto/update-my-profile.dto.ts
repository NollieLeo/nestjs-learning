import { IsOptional, ValidateNested, IsString } from 'class-validator';
import { UpdateMyProfileRequest } from '@nestjs-learning/shared';
import { Type } from 'class-transformer';
import { ProfileDto } from '../../user/dto/create-user.dto';

export class UpdateMyProfileDto implements UpdateMyProfileRequest {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile?: ProfileDto;
}

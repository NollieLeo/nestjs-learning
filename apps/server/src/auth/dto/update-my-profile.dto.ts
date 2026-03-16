import { IsOptional, ValidateNested, IsString } from 'class-validator';
import { UpdateMyProfileRequest } from '@nestjs-learning/shared';
import { Type, Transform } from 'class-transformer';
import { trimString } from '../../utils/transformer.util';
import { ProfileDto } from '../../user/dto/create-user.dto';

export class UpdateMyProfileDto implements UpdateMyProfileRequest {
  @IsOptional()
  @IsString()
  @Transform(trimString)
  username?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile?: ProfileDto;
}

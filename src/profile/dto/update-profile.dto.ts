import { Gender } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ProfileUpdateDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  avatar?: string;
}

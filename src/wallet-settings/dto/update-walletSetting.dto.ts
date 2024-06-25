import { PartialType } from '@nestjs/mapped-types';
import { WalletSettingDto } from './create-walletSetting';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateWalletSettingDto extends PartialType(WalletSettingDto) {
  @IsOptional()
  @IsString()
  walletName: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive()
  beginning_balance: number;
}

import { IsNumber, IsPositive, IsString } from 'class-validator';

export class WalletSettingDto {
  @IsString()
  walletName: string;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive()
  beginning_balance: number;
}

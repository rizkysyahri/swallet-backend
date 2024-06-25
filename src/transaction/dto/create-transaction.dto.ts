import { IsNegative, IsNumber, IsPositive, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  walletId: string;

  @IsString()
  categoryId: string;

  @IsString()
  label: string;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsNegative()
  amount: number;
}

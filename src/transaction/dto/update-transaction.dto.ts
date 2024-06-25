import { PartialType } from '@nestjs/mapped-types';
import { TransactionDto } from './create-transaction.dto';
import { IsNegative, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto extends PartialType(TransactionDto) {
  @IsOptional()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  label: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsNegative()
  amount: number;
}

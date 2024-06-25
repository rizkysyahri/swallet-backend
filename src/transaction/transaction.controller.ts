import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createTransaction(@Body() transactionDto: TransactionDto, @Req() req) {
    const userId = req.userId;
    return await this.transactionService.createTransaction(
      transactionDto,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async getTransaction(@Req() req) {
    const userId = req.userId;
    return await this.transactionService.getTransaction(userId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req,
  ) {
    const userId = req.userId;

    return this.transactionService.updateTransaction(
      id,
      updateTransactionDto,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTransaction(@Param('id') id: string, @Req() req) {
    const userId = req.userId;

    return this.transactionService.deleteTransaction(id, userId);
  }
}

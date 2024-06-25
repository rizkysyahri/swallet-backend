import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TransactionDto } from './dto/create-transaction.dto';
import { Prisma } from '@prisma/client';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(transactionData: TransactionDto, userId: string) {
    const { walletId, categoryId, label, amount } = transactionData;

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const newTransaction = await prisma.expense.create({
        data: {
          walletId: walletId,
          categoryId: categoryId,
          label: label,
          amount: new Prisma.Decimal(amount),
          userId,
        },
      });

      await prisma.walletSetting.update({
        where: { id: walletId },
        data: {
          beginning_balance: {
            decrement: Math.abs(amount),
          },
        },
      });

      return newTransaction;
    });

    return {
      ...transaction,
      amount: transaction.amount.toNumber(),
    };
  }

  async getTransaction(userId: string) {
    const transactions = await this.prisma.expense.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
    });

    return transactions.map((transaction) => {
      const { categoryId, ...transactionWithoutCategoryId } = transaction;
      return transactionWithoutCategoryId;
    });
  }

  async updateTransaction(
    id: string,
    updateTransactionData: UpdateTransactionDto,
    userId: string,
  ) {
    const transaction = await this.prisma.expense.findUnique({
      where: {
        id,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const { amount: oldAmount } = transaction;
    const { amount: newAmount } = updateTransactionData;

    const updatedTransaction = await this.prisma.$transaction(
      async (prisma) => {
        const updated = await prisma.expense.update({
          where: {
            id: id,
            userId,
          },
          data: {
            ...updateTransactionData,
            amount: newAmount
              ? new Prisma.Decimal(updateTransactionData.amount)
              : undefined,
          },
        });

        if (newAmount !== undefined && newAmount !== null) {
          const diff = new Prisma.Decimal(newAmount).minus(oldAmount);

          await prisma.walletSetting.update({
            where: {
              id: transaction.walletId,
            },
            data: {
              beginning_balance: {
                decrement: diff.toNumber(),
              },
            },
          });
        }

        return updated;
      },
    );

    return {
      ...updatedTransaction,
      amount: updateTransactionData.amount,
    };
  }

  async deleteTransaction(id: string, userId: string) {
    const transaction = await this.prisma.expense.findUnique({
      where: {
        id,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    if (transaction.userId !== userId) {
      throw new Error('User is not authorized to delete this thread');
    }

    const { walletId, amount } = transaction;

    await this.prisma.$transaction(async (prisma) => {
      await prisma.expense.delete({
        where: { id },
      });

      await prisma.walletSetting.update({
        where: { id: walletId },
        data: {
          beginning_balance: {
            increment: Math.abs(amount.toNumber()),
          },
        },
      });
    });

    return {
      message: `Transaction with ID ${id} has been deleted`,
    };
  }
}

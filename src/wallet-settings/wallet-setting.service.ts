import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WalletSettingDto } from './dto/create-walletSetting';
import { Prisma } from '@prisma/client';
import { UpdateWalletSettingDto } from './dto/update-walletSetting.dto';

@Injectable()
export class WalletSettingService {
  constructor(private prisma: PrismaService) {}

  async findWalletSetting(userId: string) {
    return await this.prisma.walletSetting.findMany({
      where: {
        userId,
      },
      include: {
        expense: {
          select: {
            id: true,
            date: true,
            label: true,
            amount: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getWalletById(id: string, userId: string) {
    return await this.prisma.walletSetting.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        expense: {
          select: {
            id: true,
            date: true,
            label: true,
            amount: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async createWalletSetting(
    walletSettingData: WalletSettingDto,
    userId: string,
  ) {
    const walletSetting = await this.prisma.walletSetting.create({
      data: {
        walletName: walletSettingData.walletName,
        beginning_balance: new Prisma.Decimal(
          walletSettingData.beginning_balance,
        ),
        userId,
      },
    });

    return walletSetting;
  }

  async updateTransaction(
    id: string,
    updateWalletSettingData: UpdateWalletSettingDto,
    userId: string,
  ) {
    const wallet = await this.prisma.walletSetting.findUnique({
      where: {
        id,
      },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    const updated = await this.prisma.walletSetting.update({
      where: {
        id: id,
        userId,
      },
      data: {
        ...updateWalletSettingData,
        beginning_balance: new Prisma.Decimal(
          updateWalletSettingData.beginning_balance,
        ),
      },
    });

    return updated;
  }

  async deleteWalletSettings(id: string, userId: string) {
    const wallet = await this.prisma.walletSetting.findUnique({
      where: {
        id,
      },
    });

    if (!wallet) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    if (wallet.userId !== userId) {
      throw new Error('User is not authorized to delete this thread');
    }

    await this.prisma.walletSetting.delete({
      where: { id },
    });

    return {
      message: `Wallet with ID ${id} has been deleted`,
    };
  }
}

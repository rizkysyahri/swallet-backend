import { Module } from '@nestjs/common';
import { WalletSettingService } from './wallet-setting.service';
import { PrismaService } from 'src/prisma.service';
import { WalletSettingController } from './wallet-setting.controller';

@Module({
  controllers: [WalletSettingController],
  providers: [WalletSettingService, PrismaService],
})
export class WalletSettingModule {}

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
import { WalletSettingService } from './wallet-setting.service';
import { WalletSettingDto } from './dto/create-walletSetting';
import { UpdateWalletSettingDto } from './dto/update-walletSetting.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('wallet-settings')
export class WalletSettingController {
  constructor(private walletSettingService: WalletSettingService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findWalletSetting(@Req() req) {
    const userId = req.userId;
    return await this.walletSettingService.findWalletSetting(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getWalletById(@Param('id') id: string, @Req() req) {
    const userId = req.userId;
    return await this.walletSettingService.getWalletById(id, userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createWalletSetting(
    @Body() walletSettingDto: WalletSettingDto,
    @Req() req,
  ) {
    const userId = req.userId;
    return await this.walletSettingService.createWalletSetting(
      walletSettingDto,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateWalletSetting(
    @Param('id') id: string,
    @Body() updateWalletSettingDto: UpdateWalletSettingDto,
    @Req() req,
  ) {
    const userId = req.userId;
    return await this.walletSettingService.updateTransaction(
      id,
      updateWalletSettingDto,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteWalletSettings(@Param('id') id: string, @Req() req) {
    const userId = req.userId;

    return await this.walletSettingService.deleteWalletSettings(id, userId);
  }

  @UseGuards(AuthGuard)
  @Get('chart/:id')
  async getWalletAndExpenseForChart(@Param('id') id: string, @Req() req) {
    const userId = req.userId;

    return await this.walletSettingService.getWalletAndExpenseForChart(
      id,
      userId,
    );
  }
}

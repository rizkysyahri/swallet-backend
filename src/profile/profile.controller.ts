import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileUpdateDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Req() req) {
    const userId = req.userId;
    return await this.profileService.getProfiles(userId);
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateProfile(@Body() profileUpdateDto: ProfileUpdateDto, @Req() req) {
    const userId = req.userId;
    return await this.profileService.updateProfile(profileUpdateDto, userId);
  }
}

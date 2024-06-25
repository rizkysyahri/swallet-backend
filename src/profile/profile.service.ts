import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProfileUpdateDto } from './dto/update-profile.dto';
import { Gender } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(profileUpdateData: ProfileUpdateDto, userId: string) {
    const updateData: { name?: string; gender?: Gender; avatar?: string } = {};

    if (
      profileUpdateData.name !== null &&
      profileUpdateData.name !== undefined
    ) {
      if (typeof profileUpdateData.name === 'string') {
        updateData.name = profileUpdateData.name;
      }
    }
    if (
      profileUpdateData.gender !== null &&
      profileUpdateData.gender !== undefined
    ) {
      if (typeof profileUpdateData.gender === 'string') {
        updateData.gender = profileUpdateData.gender as Gender;
      }
    }
    if (
      profileUpdateData.avatar !== null &&
      profileUpdateData.avatar !== undefined
    ) {
      if (typeof profileUpdateData.avatar === 'string') {
        updateData.avatar = profileUpdateData.avatar;
      }
    }

    const updatedProfile = await this.prisma.profile.update({
      where: {
        userId,
      },
      data: updateData,
    });

    if (!updatedProfile) {
      throw new NotFoundException(`Profile with userId ${userId} not found`);
    }

    return updatedProfile;
  }

  async getProfiles(userId: string) {
    return await this.prisma.profile.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            walletSetting: true,
            Expense: true,
          },
        },
      },
    });
  }
}

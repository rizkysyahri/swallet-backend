import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProfileUpdateDto } from './dto/update-profile.dto';
import { Gender } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(profileUpdateData: ProfileUpdateDto, userId: string) {
    const updateData: { username?: string; gender?: Gender; avatar?: string } =
      {};

    if (
      profileUpdateData.username !== null &&
      profileUpdateData.username !== undefined
    ) {
      if (typeof profileUpdateData.username === 'string') {
        updateData.username = profileUpdateData.username;
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

    if (updateData.username) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: updateData.username,
        },
      });
    }

    const updatedProfile = await this.prisma.profile.update({
      where: {
        userId,
      },
      data: {
        gender: updateData.gender,
        avatar: updateData.avatar,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
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

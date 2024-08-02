import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findCategory(userId: string) {
    return await this.prisma.category.findMany({
      where: {
        userId,
      },
    });
  }

  async createCategory(categoryData: CategoryDto, userId: string) {
    const category = await this.prisma.category.create({
      data: {
        name: categoryData.name,
        userId,
      },
    });

    return category;
  }

  async deleteCategoryById(id: string, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.userId !== userId) {
      throw new Error(`User is not authorized to delete this category`);
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: `Category with id ${id} has beel deleted`,
    };
  }
}

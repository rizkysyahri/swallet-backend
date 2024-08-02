import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findCategory(@Req() req) {
    const userId = req.userId;
    return await this.categoryService.findCategory(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async craeteCategory(@Body() categoryDto: CategoryDto, @Req() req) {
    const userId = req.userId;

    return await this.categoryService.createCategory(categoryDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCategoruById(@Param('id') id: string, @Req() req) {
    const userId = req.userId;

    return this.categoryService.deleteCategoryById(id, userId);
  }
}

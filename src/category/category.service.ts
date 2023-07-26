import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FindCategoryDto } from './dto/find-category-dto';

@Injectable()
export class CategoryService {

  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    await this.notExistWithName(name);
    try {
      return this.categoryModel.create(createCategoryDto);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in create category: ${exception.message}`);
    }

  }

  private async notExistWithName(name: string) {
    const existCategory = await this.categoryModel.exists({ name });
    if (existCategory)
      throw new BadRequestException(`Exist category with name: ${name}`);
  }

  async findAll() {
    const categories = await this.categoryModel.find();
    const findCategoriesDto: FindCategoryDto[] = [];
    for (const { id } of categories) {
      const category = await this.findOneById(id);
      findCategoriesDto.push(category);
    }
    return findCategoriesDto;

  }

  async findOneById(id: string): Promise<FindCategoryDto> {
    const category = await this.categoryModel.findById(id);
    if (category) {
      const { name } = category;
      return {
        id,
        name
      };
    }
    throw new BadRequestException(`Not exist category with id: ${id}`);
  }
  async existAllWithIds(categories: string[]) {
    if (categories) {
      for (const categoryId of categories) {
        await this.existWithId(categoryId);
      }
    }
  }

  private async existWithId(id: string) {
    const existCategory = await this.categoryModel.exists({ _id: id });
    if (!existCategory)
      throw new BadRequestException(`Not exist category with id: ${id}`);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOneById(id);
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto);
  }

  async remove(id: string) {
    await this.findOneById(id);
    return this.categoryModel.findByIdAndDelete(id);
  }
}
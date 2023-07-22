import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {

  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    await this.existWithName(name);
    return this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  private async existWithName(name: string) {
    const existCategory = await this.categoryModel.exists({ name });
    if (existCategory)
      throw new BadRequestException(`Exist category with name: ${name}`);
  }

  async findOneById(id: string) {
    const category = await this.categoryModel.findById(id);
    if (category)
      return category;
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
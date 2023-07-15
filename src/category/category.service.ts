import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {

  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    await this.existCategoryWithName(name);
    return this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  private async existCategoryWithName(name: string) {
    const existCategory = await this.categoryModel.exists({ name });
    if(existCategory)
      throw new BadRequestException(`Exist category with name: ${name}`);
  }

  async findOneById(id: string) {
    const category = await this.categoryModel.findById(id);
    if (category)
      return category;
    throw new BadRequestException(`Not exist category with id: ${id}`);
  }
  
  async existCategoryWithId(id: string){
    const existCategory = await this.categoryModel.exists({id});
    if(!existCategory)
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
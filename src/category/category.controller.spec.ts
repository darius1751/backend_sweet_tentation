import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { FindCategoryDto } from './dto/find-category-dto';
import { CategoryModule } from './category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService]
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined categoryController', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined categoryService', () => {
    expect(categoryService).toBeDefined();
  });

  it('test findAll', async () => {
    const categories: FindCategoryDto[] = [];
    jest.spyOn(categoryService, 'findAll').mockImplementation(async () => categories);
    expect(await controller.findAll()).toBe(categories);
  });
});

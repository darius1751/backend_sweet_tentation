import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/role.enum';

@Controller('category')
export class CategoryController {

  constructor(private readonly categoryService: CategoryService) { }

  @Roles(Role.ADMINISTRATOR)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Roles(Role.ALL)
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Roles(Role.ALL)
  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.findOneById(id);
  }

  @Roles(Role.ADMINISTRATOR)
  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Roles(Role.ADMINISTRATOR)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PermissionGuard } from 'src/common/guards/permission/permission.guard';
import { RequirePermission } from 'src/common/decorators/requirePermission.decorator';
import { Permission as PermissionEnum } from 'src/common/permission.enum';
@UseGuards(PermissionGuard)
@Controller('category')
export class CategoryController {

  constructor(private readonly categoryService: CategoryService) { }

  
  @RequirePermission(PermissionEnum.CREATE_CATEGORY)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
  
  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.findOneById(id);
  }

  @RequirePermission(PermissionEnum.UPDATE_CATEGORY)
  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @RequirePermission(PermissionEnum.DELETE_CATEGORY)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.remove(id);
  }  
}

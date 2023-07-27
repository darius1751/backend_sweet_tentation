import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseFilters, Query, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateFile } from 'src/common/utils/validateFile';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { CreateAdditionDto } from './dto/create-addition.dto';
import { UpdateAdditionDto } from './dto/update-addition.dto';
import { AdditionService } from './addition.service';
import { CreateWithFileErrorFilter } from 'src/common/filters/create-with-file-error/create-with-file-error.filter';
import { RequirePermission } from 'src/common/decorators/requirePermission.decorator';
import { Permission } from 'src/common/permission.enum';
import { PermissionGuard } from 'src/common/guards/permission/permission.guard';
import { ParseIntPaginationPipe } from 'src/common/pipes/parse-int-pagination/parse-int-pagination.pipe';

@UseGuards(PermissionGuard)
@Controller('addition')
export class AdditionController {

  constructor(private readonly additionService: AdditionService) { }

  @RequirePermission(Permission.CREATE_ADDITION)
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    dest: './temp',
    fileFilter: validateFile,
    limits: {
      fileSize: 2000000 //2MB
    }
  }))
  @UseFilters(CreateWithFileErrorFilter)
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createAdditionDto: CreateAdditionDto) {
    return this.additionService.create(image, createAdditionDto);
  }

  @Get()
  findAll(
    @Query('skip', ParseIntPaginationPipe) skip: number,
    @Query('take', ParseIntPaginationPipe) take: number
  ) {
    return this.additionService.findAll(skip, take);
  }


  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.additionService.findOneById(id);
  }

  @RequirePermission(Permission.UPDATE_ADDITION)
  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateAdditionDto: UpdateAdditionDto) {
    return this.additionService.update(id, updateAdditionDto);
  }

  @RequirePermission(Permission.DELETE_ADDITION)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.additionService.remove(id);
  }
}

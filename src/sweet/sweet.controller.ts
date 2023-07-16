import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { SweetService } from './sweet.service';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { validateFile } from 'src/utils/validateFile';
import { CreateSweetImagesDto } from './dto/create-sweet-images.dto';

@Controller('sweet')
export class SweetController {

  constructor(private readonly sweetService: SweetService) { }

  @Post()
  
  @UseInterceptors(
    FileFieldsInterceptor([{
      name: 'mainImage', maxCount: 1
    }, {
      name: 'images', maxCount: 4
    }], {
      fileFilter: validateFile,
      dest: './temp',
      limits:{
        fileSize: 2000000 //2MB
      },
    })
  )
  create(
    @UploadedFiles() createSweetImagesDto: CreateSweetImagesDto,
    @Body() createSweetDto: CreateSweetDto
  ) {
    return this.sweetService.create(createSweetImagesDto, createSweetDto);
  }

  @Get()
  findAll(
    @Param('skip', ParseIntPipe) skip: number,
    @Param('take', ParseIntPipe) take: number
  ) {
    return this.sweetService.findAll(skip, take);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.sweetService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetService.update(id, updateSweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sweetService.remove(id);
  }
}
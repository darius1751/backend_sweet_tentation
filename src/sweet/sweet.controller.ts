import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SweetService } from './sweet.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';

@Controller('sweet')
export class SweetController {
  constructor(private readonly sweetService: SweetService) {}

  @Post()
  create(@Body() createSweetDto: CreateSweetDto) {
    return this.sweetService.create(createSweetDto);
  }

  @Get()
  findAll() {
    return this.sweetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sweetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetService.update(+id, updateSweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sweetService.remove(+id);
  }
}

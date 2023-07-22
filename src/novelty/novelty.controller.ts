import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';
import { NoveltyService } from './novelty.service';
import { MongoIdPipe } from 'src/pipes/mongo-id/mongo-id.pipe';

@Controller('novelty')
export class NoveltyController {

  constructor(private readonly noveltyService: NoveltyService) { }

  @Post()
  create(@Body() createNoveltyDto: CreateNoveltyDto) {
    return this.noveltyService.create(createNoveltyDto);
  }

  @Get()
  findAll(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number
  ) {
    return this.noveltyService.findAll(skip, take);
  }

  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.noveltyService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateNoveltyDto: UpdateNoveltyDto) {
    return this.noveltyService.update(id, updateNoveltyDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.noveltyService.remove(id);
  }
}

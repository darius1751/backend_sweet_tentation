import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';
import { NoveltyService } from './novelty.service';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { RequirePermission } from 'src/common/decorators/requirePermission.decorator';
import { Permission } from 'src/common/permission.enum';
import { PermissionGuard } from 'src/common/guards/permission/permission.guard';

@UseGuards(PermissionGuard)
@Controller('novelty')
export class NoveltyController {

  constructor(private readonly noveltyService: NoveltyService) { }
  
  @RequirePermission(Permission.CREATE_NOVELTY)
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

  @RequirePermission(Permission.UPDATE_NOVELTY)
  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateNoveltyDto: UpdateNoveltyDto) {
    return this.noveltyService.update(id, updateNoveltyDto);
  }

  @RequirePermission(Permission.DELETE_NOVELTY)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.noveltyService.remove(id);
  }
}

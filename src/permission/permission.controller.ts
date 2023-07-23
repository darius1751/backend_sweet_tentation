import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.permissionService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.permissionService.remove(id);
  }
}

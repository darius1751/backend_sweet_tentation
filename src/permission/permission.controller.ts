import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { RequirePermission } from 'src/common/decorators/requirePermission.decorator';
import { Permission } from 'src/common/permission.enum';
import { PermissionGuard } from 'src/common/guards/permission/permission.guard';

@UseGuards(PermissionGuard)
@Controller('permission')
export class PermissionController {

  constructor(private readonly permissionService: PermissionService) { }

  @RequirePermission(Permission.CREATE_PERMISSION)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @RequirePermission(Permission.CREATE_MANY_PERMISSIONS)
  @Post('many')
  createMany(@Body() createPermissionDto: CreatePermissionDto[]) {
    return this.permissionService.createMany(createPermissionDto);
  }

  @RequirePermission(Permission.FIND_ALL_PERMISSIONS)
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @RequirePermission(Permission.FIND_ONE_PERMISSION_BY_ID)
  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.permissionService.findOneById(id);
  }

  @RequirePermission(Permission.UPDATE_PERMISSION)
  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @RequirePermission(Permission.DELETE_PERMISSION)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.permissionService.remove(id);
  }
}

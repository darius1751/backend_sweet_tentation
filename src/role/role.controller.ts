import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {

  constructor(private readonly roleService: RoleService) { }

  @Post()
  create(
    @Body() createRoleDto: CreateRoleDto
  ) {
    return this.roleService.create(createRoleDto);
  }
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.roleService.findOneById(id);
  }
}

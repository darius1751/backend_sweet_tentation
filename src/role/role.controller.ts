import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';

@Controller('role')
export class RoleController {

  constructor(private readonly roleService: RoleService) { }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.roleService.findOneById(id);
  }
}

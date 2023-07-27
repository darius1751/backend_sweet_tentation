import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { CreateRoleDto } from './dto/create-role.dto';
import { RequirePermission } from 'src/common/decorators/requirePermission.decorator';
import { Permission } from 'src/common/permission.enum';

@Controller('role')
export class RoleController {

  constructor(private readonly roleService: RoleService) { }
  
  @RequirePermission(Permission.CREATE_ROLE)
  @Post()
  create(
    @Body() createRoleDto: CreateRoleDto
  ) {
    return this.roleService.create(createRoleDto);
  }
  
  @RequirePermission(Permission.CREATE_MANY_ROLES)
  @Post('many')
  createMany(
    @Body() createRolesDto: CreateRoleDto[]
  ) {
    return this.roleService.createMany(createRolesDto);
  }

  @RequirePermission(Permission.FIND_ALL_ROLES)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @RequirePermission(Permission.FIND_ONE_ROLE_BY_ID)
  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.roleService.findOneById(id);
  }
}

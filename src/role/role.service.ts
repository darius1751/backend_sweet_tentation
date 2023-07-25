import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { PermissionService } from 'src/permission/permission.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {

  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly permissionService: PermissionService
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const { permissions, name } = createRoleDto;
    await this.notExistWithName(name);
    await this.permissionService.existAllWithIds(permissions);

    try {
      return await this.roleModel.create(createRoleDto);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in create role: ${exception.message}`);
    }
  }

  private async notExistWithName(name: string) {
    const role = await this.roleModel.exists({ name });
    if (role)
      throw new BadRequestException(`Exist role with name: ${name}`);
  }

  async findAll() {
    const roles = await this.roleModel.find();
    const formattedRoles = [];
    for (const { id } of roles) {
      const role = await this.findOneById(id);
      formattedRoles.push(role);
    }
    return formattedRoles;
  }

  async findOneById(id: string) {
    const role = await this.roleModel.findById(id);
    if (role) {
      const { id, name, permissions: permissionsIds } = role;
      const permissions = [];
      for (const permissionId of permissionsIds) {
        const permission = await this.permissionService.findOneById(permissionId);
        permissions.push(permission);
      }

      return {
        id,
        name,
        permissions
      };
    }
    throw new BadRequestException(`Not exist role with id: ${id}`);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOneById(id);
    const { permissions, name } = updateRoleDto;
    if (name)
      await this.notExistWithName(name);
    if (permissions)
      await this.permissionService.existAllWithIds(permissions);
    try {
      return await this.roleModel.findByIdAndUpdate(id, updateRoleDto);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in update role: ${exception.message}`);
    }
  }
}

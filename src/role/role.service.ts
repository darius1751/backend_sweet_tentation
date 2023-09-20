import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { PermissionService } from '../permission/permission.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindPermissionDto } from '../permission/dto/find-permission.dto';
import { FindRoleDto } from './dto/find-role.dto';

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

  async createMany(createRolesDto: CreateRoleDto[]) {
    for (const { permissions, name } of createRolesDto) {
      await this.notExistWithName(name);
      await this.permissionService.existAllWithIds(permissions);
    }
    try {
      return await this.roleModel.insertMany(createRolesDto);
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
    const findRolesDto: FindRoleDto[] = [];
    for (const { id, name, permissions: permissionsIds } of roles) {
      const permissions: FindPermissionDto[] = await this.permissionService.formatted(permissionsIds);
      findRolesDto.push({ id, name, permissions });
    }
    return findRolesDto;
  }

  async findOneById(id: string): Promise<FindRoleDto> {
    const role = await this.roleModel.findById(id);
    if (role) {
      const { name, permissions: permissionsIds } = role;
      const permissions: FindPermissionDto[] = await this.permissionService.formatted(permissionsIds);
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

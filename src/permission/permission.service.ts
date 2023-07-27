import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './entities/permission.entity';
import { Model } from 'mongoose';
import { FindPermissionDto } from './dto/find-permission.dto';

@Injectable()
export class PermissionService {

  constructor(
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>
  ) { }

  async create(createPermissionDto: CreatePermissionDto) {
    const { name } = createPermissionDto;
    await this.notExistWithName(name);
    try {
      return await this.permissionModel.create(createPermissionDto);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in create permission: ${exception.message}`);
    }
  }

  async notExistWithName(name: string) {
    const permission = await this.permissionModel.exists({ name });
    if (permission)
      throw new BadRequestException(`Exist permission with name: ${name}`);
  }

  private async existWithId(id: string) {
    const permission = await this.permissionModel.exists({ _id: id });
    if (!permission)
      throw new BadRequestException(`Not Exist permission with id: ${id}`);
  }

  async existAllWithIds(permissions: string[]) {
    for (let permission of permissions) {
      await this.existWithId(permission);
    }
  }

  async formatted(permissionsIds: string[]) {
    const permissions: FindPermissionDto[] = [];
    for (const permissionId of permissionsIds) {
      const permission = await this.findOneById(permissionId);
      permissions.push(permission);
    }
    return permissions;
  }
  async findAll() {
    const permissions = await this.permissionModel.find();
    const findPermissionsDto: FindPermissionDto[] = [];
    for (const { id, name, description } of permissions) {
      findPermissionsDto.push({ id, name, description });
    }
    return findPermissionsDto;
  }

  async findOneById(id: string): Promise<FindPermissionDto> {
    const permission = await this.permissionModel.findById(id);
    if (permission) {
      const { id, name, description } = permission;
      return {
        id,
        name,
        description
      };
    }
    throw new BadRequestException(`Not exist permission with id: ${id}`);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    await this.findOneById(id);
    try {
      return await this.permissionModel.findByIdAndUpdate(id, updatePermissionDto);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in update permission: ${exception.message}`);
    }
  }

  async remove(id: string) {
    await this.findOneById(id);
    try {
      return await this.permissionModel.findByIdAndDelete(id);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in remove permission ${exception.message}`);
    }
  }
}

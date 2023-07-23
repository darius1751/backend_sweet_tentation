import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './entities/permission.entity';
import { Model } from 'mongoose';

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
    for(let permission of permissions){
      await this.existWithId(permission);
    }
  }

  async findAll() {
    return await this.permissionModel.find();
  }

  async findOneById(id: string) {
    const permission = await this.permissionModel.findById(id);
    if (permission)
      return permission;
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

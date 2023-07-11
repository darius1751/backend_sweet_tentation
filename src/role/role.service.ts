import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {

  constructor(@InjectModel(Role.name) private readonly roleModel: Model<Role>) { }

  async findAll() {
    return await this.roleModel.find();
  }

  async findOneById(id: string) {
    const role = await this.roleModel.findById(id);
    if (role)
      return role;
    throw new BadRequestException(`Not exist role with id: ${id}`);
  }  
}

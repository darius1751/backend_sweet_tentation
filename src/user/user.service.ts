import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CredentialService } from 'src/credential/credential.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly credentialService: CredentialService,
    private readonly roleService: RoleService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { email, credential, phone, roleId } = createUserDto;
    await this.validateEmailAndPhone(email, phone);
    await this.roleService.findOneById(roleId);
    try {
      const { _id } = await this.credentialService.create(credential);
      return await this.userModel.create({ ...createUserDto, credentialId: _id });
    } catch (exception) {
      throw new BadRequestException(`Error`);
    }
  }

  private async validateEmailAndPhone(email: string, phone: string) {
    if (this.existEmail(email))
      throw new BadRequestException(`Email: ${email} exist in db`);
    if (this.existPhone(phone))
      throw new BadRequestException(`Phone: ${phone} exist in db`);
  }

  private async existEmail(email: string) {
    const { _id } = await this.userModel.exists({ email });
    return _id != null;
  }

  private async existPhone(phone: string) {
    const { _id } = await this.userModel.exists({ phone });
    return _id != null;
  }

  async findAll(skip: number, take: number) {
    try {
      return this.userModel.find({}, {}, { limit: take, skip });
    } catch (exception) {
      throw new BadRequestException(`skip and take is a positive int`);
    }
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id);
    if (user)
      return user;
    throw new BadRequestException(`Not exist user with id: ${id}`);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOneById(id);
    try {
      return this.userModel.findByIdAndUpdate(id, updateUserDto);
    } catch (exception) {
      throw new BadRequestException(`Error`);
    }
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    if(user.active)
      return await this.userModel.findByIdAndUpdate(id, { $set: { active: false } });
    throw new BadRequestException(`User with id: ${id} not is active`);
  }
}

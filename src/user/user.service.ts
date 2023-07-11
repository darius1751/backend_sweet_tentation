import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CredentialService } from 'src/credential/credential.service';
import { RoleService } from 'src/role/role.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginCredentialDto } from 'src/credential/dto/login-credential.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly credentialService: CredentialService,
    private readonly roleService: RoleService
  ) { }

  async login(loginCredentialDto: LoginCredentialDto) {
    const credentialId = await this.credentialService.login(loginCredentialDto);
    const user = await this.userModel.findOne({ credentialId, active: true }, { credentialId: false });
    if (user)
      return user;
    throw new ForbiddenException(`User not active`);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, credential, phone, roleId } = createUserDto;
    await this.validateEmailAndPhone(email, phone);
    await this.roleService.findOneById(roleId);
    try {
      const { _id } = await this.credentialService.create(credential);
      return await this.userModel.create({ ...createUserDto, credentialId: _id });
    } catch (exception) {
      throw new BadRequestException(`${exception.message}`);
    }
  }

  private async validateEmailAndPhone(email: string, phone: string) {
    const existEmail = await this.existEmail(email);
    if (existEmail)
      throw new BadRequestException(`Email: ${email} exist in db`);
    const existPhone = await this.existPhone(phone);
    if (existPhone)
      throw new BadRequestException(`Phone: ${phone} exist in db`);
  }

  private async existEmail(email: string) {
    const existEmail = await this.userModel.exists({ email });
    return existEmail != null;
  }

  private async existPhone(phone: string) {
    const existPhone = await this.userModel.exists({ phone });
    return existPhone != null;
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
      throw new BadRequestException(`Error in update`);
    }
  }

  async remove(id: string) {
    const { active } = await this.findOneById(id);
    if (active)
      return await this.userModel.findByIdAndUpdate(id, { $set: { active: false } });
    throw new BadRequestException(`User with id: ${id} not is active`);
  }
}

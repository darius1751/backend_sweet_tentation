import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginCredentialDto } from 'src/credential/dto/login-credential.dto';
import { AuthService } from 'src/auth/auth.service';
import { CredentialService } from 'src/credential/credential.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly credentialService: CredentialService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService
  ) { }

  async login(loginCredentialDto: LoginCredentialDto) {
    const credentialId = await this.credentialService.login(loginCredentialDto);
    const user = await this.userModel.findOne({ credentialId, active: true }, { credentialId: false });
    if (user) {
      const accessToken = await this.authService.createAccessToken({ user: loginCredentialDto.user, role: user.role })
      return { user, access_token: accessToken };
    }
    throw new ForbiddenException(`User ${loginCredentialDto.user} not active or not exist`);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, credential, phone, role } = createUserDto;
    await this.notExistEmail(email);
    await this.notExistPhone(phone);
    await this.roleService.findOneById(role);
    try {
      const { _id } = await this.credentialService.create(credential);
      return await this.userModel.create({ ...createUserDto, credentialId: _id });
    } catch (exception) {
      throw new BadRequestException(`${exception.message}`);
    }
  }

  private async notExistEmail(email: string) {
    const existEmail = await this.userModel.exists({ email });
    if (existEmail)
      throw new BadRequestException(`Exist user with email: ${email}`);
  }

  private async notExistPhone(phone: string) {
    const existPhone = await this.userModel.exists({ phone });
    if (existPhone)
      throw new BadRequestException(`Exist user with phone: ${phone}`);
  }

  async findAll(skip: number, take: number) {
    try {
      return this.userModel.find({}, { credentialId: false }, { limit: take, skip });
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
      throw new BadRequestException(`Error in update user`);
    }
  }

  async remove(id: string) {
    const { active } = await this.findOneById(id);
    if (active)
      return await this.userModel.findByIdAndUpdate(id, { $set: { active: false } });
    throw new BadRequestException(`User with id: ${id} not is active`);
  }
}

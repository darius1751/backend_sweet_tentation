import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt';
import { Credential } from './entities/credential.entity';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { LoginCredentialDto } from './dto/login-credential.dto';

@Injectable()
export class CredentialService {

  constructor(
    @InjectModel(Credential.name) private readonly credentialModel: Model<Credential>
  ) { }

  async create({ user, password }: CreateCredentialDto) {
    try {
      const existUser = await this.existUser(user);
      if (!existUser)
        return await this.credentialModel.create({ user, password: hashSync(password, 10) });
      throw new BadRequestException(`Error in create user, username: ${user} exist`);
    } catch (exception) {
      throw new BadRequestException(exception.message);
    }
  }

  private async existUser(user: string) {
    const existUser = await this.credentialModel.exists({ user });
    return existUser != null;
  }

  async login({ user, password }: LoginCredentialDto) {
    const existUser = await this.existUser(user);
    if (existUser) {
      const credential = await this.credentialModel.findOne({ user });
      if (compareSync(password, credential.password))
        return credential._id;
      throw new ForbiddenException(`Error in login`);
    }
  }

  private async findOneById(id: string) {
    const credential = await this.credentialModel.findById(id);
    if (credential)
      return credential;
    throw new BadRequestException(`Not exist credential with id: ${id}`);
  }

  async update(id: string, updateCredentialDto: UpdateCredentialDto) {
    await this.findOneById(id);
    try {
      return await this.credentialModel.findByIdAndUpdate(id, updateCredentialDto);
    } catch (exception) {
      throw new InternalServerErrorException(`update credential error: ${exception.message}`);
    }
  }
}

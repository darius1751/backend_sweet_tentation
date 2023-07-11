import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Credential } from './entities/credential.entity';
import { LoginCredentialDto } from './dto/login-credential.dto';
import { compareSync, hashSync } from 'bcrypt';
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
    } catch (exception) {
      throw new BadRequestException(`Error`);
    }
  }

  private async existUser(user: string) {
    const { _id } = await this.credentialModel.exists({ user });
    return _id != null;
  }

  async login({ user, password }: LoginCredentialDto) {
    try {
      const existUser = await this.existUser(user);
      if (existUser) {
        const credential = await this.credentialModel.findOne({ user });
        if (compareSync(password, credential.password))
          return credential._id;
      }
    } catch (exception) {
      throw new BadRequestException(`Error`);
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
    try{      
      return await this.credentialModel.findByIdAndUpdate(id,updateCredentialDto);
    }catch(exception){
      throw new InternalServerErrorException(``);
    }    
  }
}

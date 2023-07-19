import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';
import { saveImage } from 'src/utils/saveImage';
import { removeImage } from 'src/utils/removeImage';
import { CreateAdditionDto } from './dto/create-addition.dto';
import { UpdateAdditionDto } from './dto/update-addition.dto';
import { Addition } from './entities/addition.entity';
import { unlink } from 'fs/promises';

@Injectable()
export class AdditionService {

  constructor(
    @InjectModel(Addition.name) private additionModel: Model<Addition>
  ) { }

  async create(image: Express.Multer.File, createAdditionDto: CreateAdditionDto) {
    const { name } = createAdditionDto;
    await this.existAdditionWithName(name);
    try {
      const { path } = image;
      const imageSecureURL = await saveImage(path, join('addition', name));
      await this.removeLocalImage(path);
      return await this.additionModel.create({ ...createAdditionDto, image: imageSecureURL });
    } catch (exception) {
      throw new InternalServerErrorException(`Error in create additional: ${exception.message}`);
    }
  }

  private async existAdditionWithName(name: string) {
    const existAddition = await this.additionModel.exists({ name });
    if (existAddition)
      throw new BadRequestException(`Addition with name ${name} exist`);
  }

  private async removeLocalImage(path: string) {
    try {
      await unlink(path);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in removeLocalImage: ${exception.message}`);
    }
  }

  async findAll(skip: number, take: number) {
    return await this.additionModel.find({}, {}, { skip, limit: take });
  }

  async findOneById(id: string) {
    const addition = await this.additionModel.findById(id);
    if (addition)
      return addition;
    throw new BadRequestException(`Not exist addition with id: ${id}`);
  }

  async update(id: string, updateAdditionDto: UpdateAdditionDto) {
    await this.findOneById(id);
    return await this.additionModel.updateOne({ id }, updateAdditionDto);
  }

  async remove(id: string) {
    const { name } = await this.findOneById(id);
    try {
      await removeImage(join('addition', name));
      return await this.additionModel.findByIdAndDelete(id);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in remove addition: ${exception.message}`);
    }
  }
}

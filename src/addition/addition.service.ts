import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';
import { saveImage } from 'src/common/utils/saveImage';
import { removeImage } from 'src/common/utils/removeImage';
import { CreateAdditionDto } from './dto/create-addition.dto';
import { UpdateAdditionDto } from './dto/update-addition.dto';
import { Addition } from './entities/addition.entity';
import { unlink } from 'fs/promises';
import { FindAdditionDto } from './dto/find-addition.dto';

@Injectable()
export class AdditionService {

  constructor(
    @InjectModel(Addition.name) private additionModel: Model<Addition>
  ) { }

  async create(image: Express.Multer.File, createAdditionDto: CreateAdditionDto) {
    const { name } = createAdditionDto;
    await this.notExistWithName(name);
    try {
      const { path } = image;
      const imageSecureURL = await saveImage(path, join('additions', name));
      await this.removeLocalImage(path);
      return await this.additionModel.create({ ...createAdditionDto, image: imageSecureURL });
    } catch (exception) {
      throw new InternalServerErrorException(`Error in create additional: ${exception.message}`);
    }
  }

  private async notExistWithName(name: string) {
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
    const additions = await this.additionModel.find({}, {}, { skip, limit: take });
    const findAdditionsDto: FindAdditionDto[] = [];
    for (const { id } of additions) {
      const addition = await this.findOneById(id);
      findAdditionsDto.push(addition);
    }
    return findAdditionsDto;
  }

  async findOneById(id: string): Promise<FindAdditionDto> {
    const addition = await this.additionModel.findById(id);
    if (addition) {
      const { id, name, price, image } = addition;
      const { id: imageId, secureUrl, createdAt, updatedAt } = image;
      return {
        id,
        name,
        price,
        image: {
          id: imageId,
          secureUrl,
          createdAt,
          updatedAt
        }
      }
    }
    throw new BadRequestException(`Not exist addition with id: ${id}`);
  }

  async update(id: string, updateAdditionDto: UpdateAdditionDto) {
    await this.findOneById(id);
    return await this.additionModel.updateOne({ id }, updateAdditionDto);
  }

  async remove(id: string) {
    const { name } = await this.findOneById(id);
    try {
      await removeImage(join('additions', name));
      return await this.additionModel.findByIdAndDelete(id);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in remove addition: ${exception.message}`);
    }
  }
}

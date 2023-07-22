import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';
import { SweetService } from 'src/sweet/sweet.service';
import { Novelty } from './entities/novelty.entity';

@Injectable()
export class NoveltyService {

  constructor(
    @InjectModel(Novelty.name) private readonly noveltyModel: Model<Novelty>,
    private sweetService: SweetService
  ) { }

  async create(createNoveltyDto: CreateNoveltyDto) {
    const { sweet } = createNoveltyDto;
    await this.sweetService.findOneById(sweet);
    await this.existNoveltyWithSweetId(sweet);
    try {
      return await this.noveltyModel.create(createNoveltyDto);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in create novelty ${exception.message}`);
    }
  }
  
  private async existNoveltyWithSweetId(id: string) {
    const novelty = await this.noveltyModel.findOne({ sweet: id });
    if (novelty)
      throw new BadRequestException(`Exist novelty of the sweet with id: ${id}`);
  }

  async findAll(skip: number, take: number) {
    return await this.noveltyModel.find({}, {}, { skip, limit: take });
  }

  async findOneById(id: string) {
    const novelty = await this.noveltyModel.findById(id);
    if (novelty)
      return novelty;
    throw new BadRequestException(`Not exist novelty with id: ${id}`);
  }

  async update(id: string, updateNoveltyDto: UpdateNoveltyDto) {
    await this.findOneById(id);
    try {
      return this.noveltyModel.findByIdAndUpdate(id, { ...updateNoveltyDto, updatedAt: Date.now() });
    } catch (exception) {
      throw new InternalServerErrorException(`Error in update novelty: ${exception.message}`);
    }
  }

  async remove(id: string) {
    await this.findOneById(id);
    try {
      return await this.noveltyModel.findByIdAndDelete(id);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in remove novelty: ${exception.message}`);
    }
  }
}

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';
import { SweetService } from 'src/sweet/sweet.service';
import { Novelty } from './entities/novelty.entity';
import { FindNoveltyDto } from './dto/find-novelty.dto';

@Injectable()
export class NoveltyService {

  constructor(
    @InjectModel(Novelty.name) private readonly noveltyModel: Model<Novelty>,
    private sweetService: SweetService
  ) { }

  async create({ sweet, ...createNoveltyDto }: CreateNoveltyDto) {
    await this.sweetService.findOneById(sweet);
    await this.notExistWithSweetId(sweet);
    try {
      return await this.noveltyModel.create({ ...createNoveltyDto, sweetId: sweet });
    } catch (exception) {
      throw new InternalServerErrorException(`Error in create novelty ${exception.message}`);
    }
  }

  private async notExistWithSweetId(id: string) {
    const novelty = await this.noveltyModel.exists({ sweet: id });
    if (novelty)
      throw new BadRequestException(`Exist novelty of the sweet with id: ${id}`);
  }

  async findAll(skip: number, take: number) {
    const novelties = await this.noveltyModel.find({}, {}, { skip, limit: take });
    const findNoveltiesDto: FindNoveltyDto[] = [];
    for (const { id } of novelties) {
      const novelty = await this.findOneById(id);
      findNoveltiesDto.push(novelty);
    }
    return findNoveltiesDto;
  }

  async findOneById(id: string): Promise<FindNoveltyDto>{
    const novelty = await this.noveltyModel.findById(id);
    if (novelty) {
      const { id, sweetId, active, createdAt, updatedAt, limitTime } = novelty;
      const sweet = await this.sweetService.findOneById(sweetId);
      return {
        id,
        sweet,
        active,
        limitTime,
        createdAt,
        updatedAt
      };
    }
    throw new BadRequestException(`Not exist novelty with id: ${id}`);
  }

  async update(id: string, updateNoveltyDto: UpdateNoveltyDto) {
    await this.findOneById(id);
    const { sweet } = updateNoveltyDto;
    if (sweet)
      await this.notExistWithSweetId(sweet);
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

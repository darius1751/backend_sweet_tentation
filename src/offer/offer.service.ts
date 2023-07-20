import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Offer } from './entities/offer.entity';
import { Model } from 'mongoose';

@Injectable()
export class OfferService {

  constructor(
    @InjectModel(Offer.name) private offerModel: Model<Offer>
  ) { }

  async create(createOfferDto: CreateOfferDto) {
    return 'This action adds a new offer';
  }

  async findAll(skip: number, take: number) {
    try {
      return await this.offerModel.find({}, {}, { skip, limit: take });
    } catch (exception) {
      throw new BadRequestException(`skip and take must be int positive`);
    }
  }

  async findOneById(id: string) {
    const offer = await this.offerModel.findById(id);
    if (offer)
      return offer;
    throw new BadRequestException(`Not exist offer with id: ${id}`);
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    await this.findOneById(id);
  }

  async remove(id: string) {
    await this.findOneById(id);
    return `This action removes a #${id} offer`;
  }
}

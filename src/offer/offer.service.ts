import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import { Offer } from './entities/offer.entity';
import { removeImage } from 'src/common/utils/removeImage';
import { saveImages } from 'src/common/utils/saveImages';
import { removeLocalImages } from 'src/common/utils/removeLocateImages';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CreateOfferImagesDto } from './dto/create-offer-images.dto';
import { SweetService } from 'src/sweet/sweet.service';

@Injectable()
export class OfferService {

  constructor(
    @InjectModel(Offer.name) private offerModel: Model<Offer>,
    private categoryService: CategoryService,
    private sweetService: SweetService
  ) { }

  async create(createOfferImagesDto: CreateOfferImagesDto, createOfferDto: CreateOfferDto) {
    const { title, categories, newPrice, normalPrice, sweets } = createOfferDto;
    const { mainImage, images } = createOfferImagesDto;
    const discount = await this.calculateDiscount(normalPrice, newPrice);
    if (!mainImage)
      throw new BadRequestException(`not send mainImage of the offer`);
    await this.existWithTitle(title);
    if (sweets) {
      await this.sweetService.existAllWithIds(sweets);
    }
    if (categories) {
      await this.categoryService.existAllWithIds(categories);
    }
    try {
      const { mainImageSecureURL, imagesSecureURL } = await saveImages({ folder: "offers", title }, mainImage[0], images);
      await removeLocalImages([...images, mainImage[0]]);
      return await this.offerModel.create({ ...createOfferDto, categories, sweets, discount, mainImage: mainImageSecureURL, images: imagesSecureURL });
    } catch (exception) {
      throw new InternalServerErrorException(`${exception.message}`);
    }
  }

  private async calculateDiscount(normalPrice: number, newPrice: number) {
    if (normalPrice < newPrice)
      throw new BadRequestException(`Normal price is smaller then newPrice`);
    try {
      return +((normalPrice - newPrice) / normalPrice).toPrecision(4);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in calculate discount: ${exception.message}`);
    }
  }
  private async existWithTitle(title: string) {
    const offer = await this.offerModel.exists({ title });
    if (offer)
      throw new BadRequestException(`Exist offer with title: ${title}`);
  }

  private async existWithId(id: string) {
    const existOffer = await this.offerModel.exists({ _id: id, active: true });
    if (!existOffer)
      throw new BadRequestException(`Sweet with id ${id} not exist.`);
  }

  async existAllWithIds(offersIds: string[]) {
    if (offersIds) {
      for (const offerId of offersIds) {
        await this.existWithId(offerId);
      }
    }
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
    const { sweets, categories, title } = updateOfferDto;
    if(title)
      await this.existWithTitle(title);
    if (sweets) {
      await this.sweetService.existAllWithIds(sweets);
    }
    if (categories) {
      await this.categoryService.existAllWithIds(categories);
    }
    try {
      return await this.offerModel.findByIdAndUpdate(id, updateOfferDto);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in update offer`);
    }

  }

  async remove(id: string) {
    const { title, images } = await this.findOneById(id);
    try {
      await removeImage(`offers/${title}/mainImage`);
      for (let i = 0; i < images.length; i++) {
        await removeImage(`offers/${title}/image${i + 1}`);
      }
      return await this.offerModel.findByIdAndDelete(id);
    } catch (exception) {
      throw new InternalServerErrorException(`${exception.message}`);
    }
  }
}

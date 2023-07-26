import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SweetService } from 'src/sweet/sweet.service';
import { OfferService } from 'src/offer/offer.service';
import { CreateSweetOrderDto } from './dto/create-sweet-order.dto';
import { AdditionService } from 'src/addition/addition.service';
import { AdditionOrderType } from './entities/addition-order.entity';
import { SweetOrder, SweetOrderType } from './entities/sweet-order.entity';
import { CreateOfferOrderDto } from './dto/create-offer-order.dto';
import { OfferOrder, OfferOrderType } from './entities/offer-order.entity';
import { isMongoId } from 'class-validator';
import { FindOrderDto } from './dto/find-order.dto';
import { FindSweetOrderDto } from './dto/find-sweet-order.dto';
import { FindOfferOrderDto } from './dto/find-offer-order.dto';
import { FindAdditionOrderDto } from './dto/find-addition-order.dto';

@Injectable()
export class OrderService {

  private readonly logger: Logger;
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private sweetService: SweetService,
    private offerService: OfferService,
    private additionService: AdditionService
  ) {
    this.logger = new Logger(OrderService.name)
  }

  async create(createOrderDto: CreateOrderDto) {
    const { sweets, offers } = createOrderDto;
    let totalToPay = 0;
    let sweetsOrder: SweetOrderType[] = undefined;
    let offersOrder: OfferOrderType[] = undefined;
    if (!(sweets || offers))
      throw new BadRequestException(`Error, please send sweets, offers or both`);
    if (sweets) {
      const sweetsIds = sweets.map(({ sweet }) => sweet);
      await this.sweetService.existAllWithIds(sweetsIds);
      const { sweetsOrder: finalSweetsOrder, totalToPaySweets } = await this.calculateSweetsOrder(sweets);
      sweetsOrder = finalSweetsOrder;
      totalToPay += totalToPaySweets;
    }

    if (offers) {
      const offersIds = offers.map(({ offer }) => offer);
      await this.offerService.existAllWithIds(offersIds);
      const { offersOrder: finalOfferOrder, totalToPayOffers } = await this.calculateOffersOrder(offers);
      offersOrder = finalOfferOrder;
      totalToPay += totalToPayOffers;
    }

    try {
      return await this.orderModel.create({ ...createOrderDto, sweets: sweetsOrder, offers: offersOrder, totalToPay });
    } catch (exception) {
      throw new InternalServerErrorException(`Error in create order: ${exception.message}`);
    }
  }

  private async calculateSweetsOrder(sweets: CreateSweetOrderDto[]) {
    const sweetsOrder: SweetOrderType[] = [];
    let totalToPaySweets = 0;
    for (const { cant, additions, sweet, observations } of sweets) {
      let totalToPaySweet = 0;
      let additionsOrder: AdditionOrderType[] = [];
      const { price, title } = await this.sweetService.findOneById(sweet);
      totalToPaySweet += cant * price;
      if (additions) {
        for (const { addition, cant } of additions) {
          const { price, name } = await this.additionService.findOneById(addition);
          additionsOrder.push({ addition, name, price, cant, totalToPay: price * cant });
          totalToPaySweet += cant * price;
        }
      }
      sweetsOrder.push({ sweet, title, price, cant, additions: additionsOrder, totalToPay: totalToPaySweet, observations });
      totalToPaySweets += totalToPaySweet;
    }
    return { sweetsOrder, totalToPaySweets };
  }

  private async calculateOffersOrder(sweets: CreateOfferOrderDto[]) {
    const offersOrder: OfferOrderType[] = [];
    let totalToPayOffers = 0;
    for (const { cant, additions, offer, observations } of sweets) {
      let totalToPayOffer = 0;
      let additionsOrder: AdditionOrderType[] = [];
      const { newPrice, title } = await this.offerService.findOneById(offer);
      totalToPayOffer += cant * newPrice;
      if (additions) {
        for (const { addition, cant } of additions) {
          const { price, name } = await this.additionService.findOneById(addition);
          additionsOrder.push({ addition, name, price, cant, totalToPay: price * cant });
          totalToPayOffer += cant * price;
        }
      }
      offersOrder.push({ offer, title, price: newPrice, cant, additions: additionsOrder, totalToPay: totalToPayOffer, observations });
      totalToPayOffers += totalToPayOffer;
    }
    return { offersOrder, totalToPayOffers };
  }

  async findAll(skip: number, take: number) {
    const orders = await this.orderModel.find({}, {}, { skip, limit: take });
    const findOrdersDto: FindOrderDto[] = [];
    for (const { id } of orders) {
      const order = await this.findOneById(id);
      findOrdersDto.push(order);
    }
    return findOrdersDto;
  }

  async findOneById(id: string): Promise<FindOrderDto> {
    const order = await this.orderModel.findById(id);
    if (order) {
      const { totalToPay, sweets, offers } = order;

      const findSweetsOrderDto = await this.applyFormattedSweets(sweets);
      const findOffersOrderDto = await this.applyFormattedOffers(offers);
      return {
        id,
        sweets: findSweetsOrderDto,
        offers: findOffersOrderDto,
        totalToPay
      }
    }
    throw new BadRequestException(`Not exist order with id: ${id}`);
  }

  private async applyFormattedSweets(sweetsOrder: SweetOrder[]) {
    const findSweetsOrderDto: FindSweetOrderDto[] = [];
    for (const { id, title, sweet, price, cant, additions, totalToPay, observations } of sweetsOrder) {
      const findAdditionsOrderDto: FindAdditionOrderDto[] = [];
      for (const additionOrder of additions) {
        const { id, addition, name, price, cant, totalToPay } = additionOrder;
        findAdditionsOrderDto.push({ id, addition, name, price, cant, totalToPay });
      }
      findSweetsOrderDto.push({ id, sweet, title, price, cant, additions: findAdditionsOrderDto, totalToPay, observations })
    }
    return findSweetsOrderDto;
  }

  private async applyFormattedOffers(offers: OfferOrder[]) {
    const findOffersOrderDto: FindOfferOrderDto[] = [];
    for (const { id, offer, title, price, cant, additions, observations, totalToPay } of offers) {
      const findAdditionsOrderDto: FindAdditionOrderDto[] = [];
      for (const additionOrder of additions) {
        const { id, addition, name, price, cant, totalToPay } = additionOrder;
        findAdditionsOrderDto.push({ id, addition, name, price, cant, totalToPay });
      }
      findOffersOrderDto.push({ id, offer, title, price, cant, additions: findAdditionsOrderDto, totalToPay, observations })
    }
    return findOffersOrderDto;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOneById(id);
    try {
      return await this.orderModel.findByIdAndUpdate(id, { ...updateOrderDto, $set: { updatedAt: Date.now() } });
    } catch (exception) {
      throw new InternalServerErrorException(`Error in update order: ${exception.message}`);
    }
  }

  async remove(id: string) {
    await this.findOneById(id);
    try {
      return await this.orderModel.findByIdAndDelete(id);
    } catch (exception) {
      throw new InternalServerErrorException(`Error in delete order ${exception.message}`);
    }
  }
}

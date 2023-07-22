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
import { SweetOrderType } from './entities/sweet-order.entity';
import { CreateOfferOrderDto } from './dto/create-offer-order.dto';
import { OfferOrderType } from './entities/offer-order.entity';
import { isMongoId } from 'class-validator';

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
    return await this.orderModel.find({}, {}, { skip, limit: take });
  }

  async findOneById(id: string) {
    const order = await this.orderModel.findById(id);
    if (order)
      return order;
    throw new BadRequestException(`Not exist order with id: ${id}`);
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

import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { AdditionOrder, AdditionOrderType } from './entities/addition-order.entity';
import { SweetOrder, SweetOrderType } from './entities/sweet-order.entity';
import { OfferOrder, OfferOrderType } from './entities/offer-order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOfferOrderDto } from './dto/create-offer-order.dto';
import { CreateSweetOrderDto } from './dto/create-sweet-order.dto';
import { FindOrderDto } from './dto/find-order.dto';
import { FindSweetOrderDto } from './dto/find-sweet-order.dto';
import { FindOfferOrderDto } from './dto/find-offer-order.dto';
import { FindAdditionOrderDto } from './dto/find-addition-order.dto';
import { CreateAdditionOrderDto } from './dto/create-addition-order.dto';
import { SweetService } from 'src/sweet/sweet.service';
import { OfferService } from 'src/offer/offer.service';
import { AdditionService } from 'src/addition/addition.service';
import { getPagination } from 'src/common/utils/getPagination';

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
    let sweetsOrder: SweetOrderType[] = [];
    let offersOrder: OfferOrderType[] = [];
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
        const { formattedAdditionsOrder, totalToPay } = await this.calculateAdditionsOrder(additions);
        additionsOrder = formattedAdditionsOrder;
        totalToPaySweets += totalToPay;
      }
      sweetsOrder.push({ sweet, title, price, cant, additions: additionsOrder, totalToPay: totalToPaySweet, observations });
      totalToPaySweets += totalToPaySweet;
    }
    return { sweetsOrder, totalToPaySweets };
  }

  private async calculateOffersOrder(offers: CreateOfferOrderDto[]) {
    const offersOrder: OfferOrderType[] = [];
    let additionsOrder: AdditionOrderType[] = [];
    let totalToPayOffers = 0;
    for (const { cant, additions, offer, observations } of offers) {
      let totalToPayOffer = 0;
      const { newPrice, title } = await this.offerService.findOneById(offer);
      totalToPayOffer += cant * newPrice;
      if (additions) {
        const { formattedAdditionsOrder, totalToPay } = await this.calculateAdditionsOrder(additions);
        additionsOrder = formattedAdditionsOrder;
        totalToPayOffer += totalToPay;
      }
      offersOrder.push({ offer, title, price: newPrice, cant, additions: additionsOrder, totalToPay: totalToPayOffer, observations });
      totalToPayOffers += totalToPayOffer;
    }
    return { offersOrder, totalToPayOffers };
  }

  private async calculateAdditionsOrder(additions: CreateAdditionOrderDto[]) {
    let totalToPay = 0;
    const additionsOrder: AdditionOrderType[] = [];
    for (const { addition, cant } of additions) {
      const { price, name } = await this.additionService.findOneById(addition);
      additionsOrder.push({ addition, name, price, cant, totalToPay: price * cant });
      totalToPay += cant * price;
    }
    return { formattedAdditionsOrder: additionsOrder, totalToPay };
  }

  async findAll(skip: number, take: number) {
    const orders = await this.orderModel.find({}, {}, { skip, limit: take });
    const findOrdersDto: FindOrderDto[] = [];
    for (const { id, totalToPay, sweets, offers } of orders) {
      const findSweetsOrderDto = await this.formattedOrderSweets(sweets);
      const findOffersOrderDto = await this.formattedOrderOffers(offers);
      return {
        id,
        sweets: findSweetsOrderDto,
        offers: findOffersOrderDto,
        totalToPay
      }
    }
    const totalRegisters = await this.orderModel.count();
    const pagination = getPagination({ skip, take, totalResults: findOrdersDto.length, totalRegisters });
    return { orders: findOrdersDto, pagination };
  }

  async findOneById(id: string): Promise<FindOrderDto> {
    const order = await this.orderModel.findById(id);
    if (order) {
      const { totalToPay, sweets, offers } = order;
      const findSweetsOrderDto = await this.formattedOrderSweets(sweets);
      const findOffersOrderDto = await this.formattedOrderOffers(offers);
      return {
        id,
        sweets: findSweetsOrderDto,
        offers: findOffersOrderDto,
        totalToPay
      }
    }
    throw new BadRequestException(`Not exist order with id: ${id}`);
  }

  private async formattedOrderSweets(sweetsOrder: SweetOrder[]) {
    const findSweetsOrderDto: FindSweetOrderDto[] = [];
    for (const { id, title, sweet, price, cant, additions, totalToPay, observations } of sweetsOrder) {
      const formattedOrderAdditions = await this.formattedOrderAdditions(additions);
      findSweetsOrderDto.push({ id, sweet, title, price, cant, additions: formattedOrderAdditions, totalToPay, observations })
    }
    return findSweetsOrderDto;
  }

  private async formattedOrderOffers(offers: OfferOrder[]) {
    const findOffersOrderDto: FindOfferOrderDto[] = [];
    for (const { id, offer, title, price, cant, additions, observations, totalToPay } of offers) {
      const formattedOrderAdditions = await this.formattedOrderAdditions(additions);
      findOffersOrderDto.push({ id, offer, title, price, cant, additions: formattedOrderAdditions, totalToPay, observations })
    }
    return findOffersOrderDto;
  }

  private async formattedOrderAdditions(additions: AdditionOrder[]) {
    const findAdditionsOrderDto: FindAdditionOrderDto[] = [];
    for (const additionOrder of additions) {
      const { id, addition, name, price, cant, totalToPay } = additionOrder;
      findAdditionsOrderDto.push({ id, addition, name, price, cant, totalToPay });
    }
    return findAdditionsOrderDto;
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

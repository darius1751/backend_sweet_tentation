import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>
  ){}

  async create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findAll(skip: number, take: number) {
    return `This action returns all order`;
  }

  async findOneById(id: string) {
    return `This action returns a #${id} order`;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string) {
    return `This action removes a #${id} order`;
  }
}

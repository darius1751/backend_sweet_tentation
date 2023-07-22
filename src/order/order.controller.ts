import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';

@Controller('order')
export class OrderController {

  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number
  ) {
    return this.orderService.findAll(skip, take);
  }

  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.orderService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.orderService.remove(id);
  }
}

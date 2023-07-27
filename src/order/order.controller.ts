import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { RequirePermission } from 'src/common/decorators/requirePermission.decorator';
import { Permission } from 'src/common/permission.enum';
import { PermissionGuard } from 'src/common/guards/permission/permission.guard';

@UseGuards(PermissionGuard)
@Controller('order')
export class OrderController {

  constructor(private readonly orderService: OrderService) { }

  @RequirePermission(Permission.CREATE_ORDER)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @RequirePermission(Permission.FIND_ALL_ORDERS)
  @Get()
  findAll(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number
  ) {
    return this.orderService.findAll(skip, take);
  }

  @RequirePermission(Permission.FIND_ONE_ORDER_BY_ID)
  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.orderService.findOneById(id);
  }

  @RequirePermission(Permission.UPDATE_ORDER)
  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @RequirePermission(Permission.DELETE_ORDER)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.orderService.remove(id);
  }
}

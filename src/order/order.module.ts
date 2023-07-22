import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { SweetModule } from 'src/sweet/sweet.module';
import { OfferModule } from 'src/offer/offer.module';
import { AdditionModule } from 'src/addition/addition.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    SweetModule,
    OfferModule,
    AdditionModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule { }

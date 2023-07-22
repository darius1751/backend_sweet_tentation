import { Module } from '@nestjs/common';
import { AdditionService } from './addition.service';
import { AdditionController } from './addition.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Addition, AdditionSchema } from './entities/addition.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Addition.name, schema: AdditionSchema }])],
  controllers: [AdditionController],
  providers: [AdditionService],
  exports: [AdditionService]
})
export class AdditionModule { }

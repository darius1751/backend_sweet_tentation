import { Module } from '@nestjs/common';
import { SweetService } from './sweet.service';
import { SweetController } from './sweet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sweet, SweetSchema } from './entities/sweet.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sweet.name, schema: SweetSchema }]),
    CategoryModule
  ],
  controllers: [SweetController],
  providers: [SweetService],
  exports: [SweetService]
})
export class SweetModule { }

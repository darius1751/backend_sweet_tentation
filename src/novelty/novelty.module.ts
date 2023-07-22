import { Module } from '@nestjs/common';
import { NoveltyService } from './novelty.service';
import { NoveltyController } from './novelty.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Novelty, NoveltySchema } from './entities/novelty.entity';
import { SweetModule } from 'src/sweet/sweet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Novelty.name, schema: NoveltySchema }]),
    SweetModule
  ],
  controllers: [NoveltyController],
  providers: [NoveltyService]
})
export class NoveltyModule { }

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { MongoIdPipe } from 'src/pipe/mongo-id/mongo-id.pipe';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) { }

  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto);
  }

  @Get()
  findAll(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number
  ) {
    return this.offerService.findAll(skip, take);
  }

  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.offerService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offerService.update(id, updateOfferDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.offerService.remove(id);
  }
}

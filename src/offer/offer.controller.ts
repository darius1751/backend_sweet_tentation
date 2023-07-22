import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UploadedFiles, UseFilters, UseInterceptors } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id/mongo-id.pipe';
import { CreateOfferImagesDto } from './dto/create-offer-images.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateWithFileErrorFilter } from 'src/filters/create-with-file-error/create-with-file-error.filter';
import { validateFile } from 'src/utils/validateFile';

@Controller('offer')
export class OfferController {

  constructor(private readonly offerService: OfferService) { }

  @Post()
  @UseFilters(CreateWithFileErrorFilter)
  @UseInterceptors(
    FileFieldsInterceptor([{
      name: 'mainImage', maxCount: 1
    }, {
      name: 'images', maxCount: 4
    }], {
      fileFilter: validateFile,
      dest: './temp',
      limits: {
        fileSize: 2000000 //2MB
      }
    })
  )
  create(
    @UploadedFiles() createOfferImagesDto: CreateOfferImagesDto,
    @Body() createOfferDto: CreateOfferDto

  ) {
    return this.offerService.create(createOfferImagesDto, createOfferDto);
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

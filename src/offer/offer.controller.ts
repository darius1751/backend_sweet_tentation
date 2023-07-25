import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UploadedFiles, UseFilters, UseInterceptors } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { CreateOfferImagesDto } from './dto/create-offer-images.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateWithFileErrorFilter } from 'src/common/filters/create-with-file-error/create-with-file-error.filter';
import { validateFile } from 'src/common/utils/validateFile';
import { RequirePermission } from 'src/common/decorators/requirePermission.decorator';
import { Permission } from 'src/common/permission.enum';

@Controller('offer')
export class OfferController {

  constructor(private readonly offerService: OfferService) { }

  @RequirePermission(Permission.CREATE_OFFER)
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

  @RequirePermission(Permission.UPDATE_OFFER)
  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offerService.update(id, updateOfferDto);
  }

  @RequirePermission(Permission.DELETE_OFFER)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.offerService.remove(id);
  }
}

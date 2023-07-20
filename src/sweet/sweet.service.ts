import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { unlink } from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import { Sweet } from './entities/sweet.entity';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { CreateSweetImagesDto } from './dto/create-sweet-images.dto';
import { UpdateSweetImagesDto } from './dto/update-sweet-images.dto';
import { CategoryService } from 'src/category/category.service';
import { join } from 'path';
import { saveImage } from 'src/utils/saveImage';
import { removeImage } from 'src/utils/removeImage';

@Injectable()
export class SweetService {

  constructor(
    @InjectModel(Sweet.name) private readonly sweetModel: Model<Sweet>,
    private categoryService: CategoryService,
  ) { }

  async create(createSweetImagesDto: CreateSweetImagesDto, createSweetDto: CreateSweetDto) {
    const { title, categories } = createSweetDto;
    await this.existSweetWithTitle(title);
    await this.validateCategories(categories);
    const { mainImage, images } = createSweetImagesDto;
    if (!mainImage)
      throw new BadRequestException(`not send mainImage of the sweet`);
    try {
      console.time('process-saveImages'); // Intentar optimizar si es posible el guardado de imagenes.
      const { mainImageSecureURL, imagesSecureURL } = await this.saveImages(title, mainImage[0], images);
      console.timeEnd('process-saveImages'); //5.41..? seg
      await this.removeLocalImages([...images, mainImage[0]]);
      return await this.sweetModel.create({ ...createSweetDto, mainImage: mainImageSecureURL, images: imagesSecureURL });
    } catch (exception) {
      throw new InternalServerErrorException(`${exception.message}`);
    }
  }

  private async existSweetWithTitle(title: string) {
    const existSweet = await this.sweetModel.exists({ title });
    if (existSweet)
      throw new BadRequestException(`Sweet with title: ${title} exist.`);
  }

  private async validateCategories(categories: string[]) {
    if (categories) {
      for (const categoryId of categories) {
        await this.categoryService.existCategoryWithId(categoryId);
      }
    }
  }

  private async saveImages(title: string, mainImage: Express.Multer.File, images: Express.Multer.File[]) {
    const mainImageSecureURL = await saveImage(mainImage.path, join("sweet", title,"mainImage"));
    const imagesSecureURL: { secureUrl: string }[] = [];
    if (images) {
      for (let i = 0; i < images.length; i++) {
        const { path } = images[i];
        imagesSecureURL.push(await saveImage(path, join("sweet", title, `image${i + 1}`)));
      }
    }
    return { mainImageSecureURL, imagesSecureURL };
  }

  

  private async removeLocalImages(images: Express.Multer.File[]) {
    for (const image of images) {
      const { path } = image;
      await unlink(path);
    }
  }

  async findAll(skip: number, take: number) {

    try {
      return await this.sweetModel.find({}, { images: false }, { skip, limit: take });
    } catch (exception) {
      throw new BadRequestException(`skip and take must be int positive`);
    }
  }

  async findOneById(id: string) {
    const sweet = await this.sweetModel.findById(id);
    if (sweet)
      return sweet;
    throw new BadRequestException(`Not exist sweet with id: ${id}`);
  }

  async update(id: string, updateSweetDto: UpdateSweetDto, updateSweetImagesDto?: UpdateSweetImagesDto) {
    const { mainImage, images } = await this.findOneById(id);
    return await this.sweetModel.findByIdAndUpdate(id, { ...updateSweetDto });
  }

  async remove(id: string) {
    const { title, images } = await this.findOneById(id);
    try {
      await removeImage(`sweet/${title}/mainImage`);
      for (let i = 0; i < images.length; i++) {
        await removeImage(`sweet/${title}/image${i + 1}`);
      }
      return this.sweetModel.findByIdAndDelete(id);
    } catch (exception) {
      throw new InternalServerErrorException(`${exception.message}`);
    }

  }
}

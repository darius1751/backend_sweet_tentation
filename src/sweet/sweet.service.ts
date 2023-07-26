import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sweet } from './entities/sweet.entity';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { CreateSweetImagesDto } from './dto/create-sweet-images.dto';
import { UpdateSweetImagesDto } from './dto/update-sweet-images.dto';
import { CategoryService } from 'src/category/category.service';
import { removeImage } from 'src/common/utils/removeImage';
import { removeLocalImages } from 'src/common/utils/removeLocateImages';
import { saveImages } from 'src/common/utils/saveImages';
import { FindCategoryDto } from 'src/category/dto/find-category-dto';
import { FindSweetDto } from './dto/find-sweet-dto';

@Injectable()
export class SweetService {

  constructor(
    @InjectModel(Sweet.name) private readonly sweetModel: Model<Sweet>,
    private categoryService: CategoryService,
  ) { }

  async create(createSweetImagesDto: CreateSweetImagesDto, createSweetDto: CreateSweetDto) {
    const { title, categories } = createSweetDto;
    await this.notExistWithTitle(title);
    await this.categoryService.existAllWithIds(categories);
    const { mainImage, images } = createSweetImagesDto;
    if (!mainImage)
      throw new BadRequestException(`not send mainImage of the sweet`);
    try {
      console.time('process-saveImages'); // Intentar optimizar si es posible el guardado de imagenes.
      const { mainImageSecureURL, imagesSecureURL } = await saveImages({ folder: "sweets", title }, mainImage[0], images);
      console.timeEnd('process-saveImages'); //5.41..? seg
      await removeLocalImages([...images, mainImage[0]]);
      return await this.sweetModel.create({ ...createSweetDto, mainImage: mainImageSecureURL, images: imagesSecureURL });
    } catch (exception) {
      throw new InternalServerErrorException(`${exception.message}`);
    }
  }

  private async notExistWithTitle(title: string) {
    const existSweet = await this.sweetModel.exists({ title });
    if (existSweet)
      throw new BadRequestException(`Sweet with title: ${title} exist.`);
  }

  private async existWithId(id: string) {
    const existSweet = await this.sweetModel.exists({ _id: id });
    if (!existSweet)
      throw new BadRequestException(`Sweet with id ${id} not exist.`);
  }

  async existAllWithIds(sweetsIds: string[]) {
    if (sweetsIds) {
      for (const sweetId of sweetsIds) {
        await this.existWithId(sweetId);
      }
    }
  }

  async findAll(skip: number, take: number) {

    const sweets = await this.sweetModel.find({}, {}, { skip, limit: take });
    const findSweetsDto: FindSweetDto[] = [];
    for (const { id } of sweets) {
      const sweet = await this.findOneById(id);
      findSweetsDto.push(sweet);
    }
    return findSweetsDto;
  }

  async findOneById(id: string): Promise<FindSweetDto> {
    const sweet = await this.sweetModel.findById(id);
    if (sweet) {
      const { title, price, mainImage, images, categories: categoriesIds, description } = sweet;
      const categories: FindCategoryDto[] = [];
      for (const categoryId of categoriesIds) {
        const category = await this.categoryService.findOneById(categoryId);
        categories.push(category);
      }
      const { id: mainImageId, createdAt, updatedAt, secureUrl } = mainImage;
      return {
        id,
        title,
        mainImage: {
          id: mainImageId,
          createdAt,
          updatedAt,
          secureUrl
        },
        images: images.map(({ id, createdAt, updatedAt, secureUrl }) => ({ id, createdAt, updatedAt, secureUrl })),
        price,
        categories,
        description
      };
    }
    throw new BadRequestException(`Not exist sweet with id: ${id}`);
  }

  async update(id: string, updateSweetDto: UpdateSweetDto, updateSweetImagesDto?: UpdateSweetImagesDto) {
    const { mainImage, images } = await this.findOneById(id);
    return await this.sweetModel.findByIdAndUpdate(id, { ...updateSweetDto });
  }

  async remove(id: string) {
    const { title, images } = await this.findOneById(id);
    try {
      await removeImage(`sweets/${title}/mainImage`);
      for (let i = 0; i < images.length; i++) {
        await removeImage(`sweets/${title}/image${i + 1}`);
      }
      return await this.sweetModel.findByIdAndDelete(id);
    } catch (exception) {
      throw new InternalServerErrorException(`${exception.message}`);
    }

  }
}

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sweet } from './entities/sweet.entity';
import { Model } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { CreateSweetImagesDto } from './dto/create-sweet-images.dto';
import { CategoryService } from 'src/category/category.service';
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
    try {
      const { mainImage, images } = createSweetImagesDto;
      console.time(); // Intentar optimizar si es posible el guardado de imagenes.
      const { mainImageSecureURL, imagesSecureURL } = await this.saveImages(title, mainImage[0], images);
      console.timeEnd(); //5.11..? seg
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
    const mainImageSecureURL = await this.saveImage(mainImage.path, title, "mainImage");
    const imagesSecureURL: { source: string }[] = [];
    for (let i = 0; i < images.length; i++) {
      const { path } = images[i];
      imagesSecureURL.push(await this.saveImage(path, title, `image${i + 1}`));
    }
    return { mainImageSecureURL, imagesSecureURL };
  }

  private async saveImage(path: string, title: string, publicId: string) {
    const { secure_url } = await cloudinary.uploader.upload(path, { public_id: `sweet/${title}/${publicId}` });
    return { source: secure_url };
  }

  async findAll(skip: number, take: number) {

    try {
      return await this.sweetModel.find({}, { images: false }, { skip, limit: take });
    } catch (exception) {
      throw new BadRequestException(`skip and take is a int positive`);
    }
  }

  async findOneById(id: string) {
    const sweet = await this.sweetModel.findById(id);
    if (sweet)
      return sweet;
    throw new BadRequestException(`Not exist sweet with id: ${id}`);
  }

  update(id: string, updateSweetDto: UpdateSweetDto) {
    return; //Implent update
  }

  async remove(id: string) {
    const { title, images } = await this.findOneById(id);
    await cloudinary.uploader.destroy(`sweet/${title}/mainImage`);
    for (let i = 0; i < images.length; i++) {
      await cloudinary.uploader.destroy(`sweet/${title}/image${i + 1}`);
    }
    return this.sweetModel.findByIdAndDelete(id);
  }
}

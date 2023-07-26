import { FindCategoryDto } from "src/category/dto/find-category-dto";
import { Image } from "../entities/image.entity"

export class FindSweetDto {
    id: string;
    title: string;
    mainImage: Image;
    images: Image[];
    price: number;
    categories: FindCategoryDto[];
    description?: string;
};
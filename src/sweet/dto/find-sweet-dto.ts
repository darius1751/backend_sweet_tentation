import { FindCategoryDto } from "src/category/dto/find-category-dto";
import { Image } from "../entities/image.entity"
import { FindImageDto } from "./find-image.dto";

export class FindSweetDto {
    id: string;
    title: string;
    mainImage: FindImageDto;
    images: FindImageDto[];
    price: number;
    categories: FindCategoryDto[];
    description?: string;
};
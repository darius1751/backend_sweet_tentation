import { FindCategoryDto } from "src/category/dto/find-category-dto"
import { FindSweetDto } from "src/sweet/dto/find-sweet-dto"
import { Image } from "src/sweet/entities/image.entity"

export class FindOfferDto {
    id: string;
    title: string;    
    mainImage: Image;
    images: Image[];
    normalPrice: number;
    newPrice: number;
    discount: number;
    active: boolean;
    sweets: FindSweetDto[];
    categories: FindCategoryDto[];
    description?: string;
    limitTime: string;
    createdAt: string;
};
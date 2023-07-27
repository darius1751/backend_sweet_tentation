import { FindCategoryDto } from "src/category/dto/find-category-dto"
import { FindImageDto } from "src/sweet/dto/find-image.dto";
import { FindSweetDto } from "src/sweet/dto/find-sweet-dto"

export class FindOfferDto {
    id: string;
    title: string;    
    mainImage: FindImageDto;
    images: FindImageDto[];
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
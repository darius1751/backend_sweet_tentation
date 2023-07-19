import { IsArray } from "class-validator";

export class CreateSweetImagesDto {
    
    @IsArray()
    public readonly mainImage: Express.Multer.File[];

    public readonly images: Express.Multer.File[];
    
}
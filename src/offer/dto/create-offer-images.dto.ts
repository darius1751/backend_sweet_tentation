import { IntersectionType } from "@nestjs/mapped-types";
import { CreateSweetImagesDto } from "src/sweet/dto/create-sweet-images.dto";

export class CreateOfferImagesDto extends IntersectionType(CreateSweetImagesDto) {}
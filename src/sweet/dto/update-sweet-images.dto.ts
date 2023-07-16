import { PartialType } from "@nestjs/mapped-types";
import { CreateSweetImagesDto } from "./create-sweet-images.dto";

export class UpdateSweetImagesDto extends PartialType(CreateSweetImagesDto) {

}
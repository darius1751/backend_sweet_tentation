import { IsString } from "class-validator";

export class CreateCategoryDto {
    
    @IsString()
    public readonly name: string;
}

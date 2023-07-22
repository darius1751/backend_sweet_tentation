import { IsMongoId, IsNumber, Min } from "class-validator";

export class CreateAdditionOrderDto {
    
    @IsMongoId()
    public readonly addition: string;

    @IsNumber()
    @Min(1)
    public readonly cant: number;
}
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { CreateAdditionOrderDto } from './create-addition-order.dto';
export class CreateSweetOrderDto {

    @IsMongoId()
    public readonly sweet: string;

    @IsNumber()
    @Min(1)
    public readonly cant: number;

    @IsArray({ context: CreateAdditionOrderDto })
    @IsOptional()
    public readonly additions?: CreateAdditionOrderDto[];

    @IsString()
    @IsOptional()
    public readonly observations?: string;

     

}
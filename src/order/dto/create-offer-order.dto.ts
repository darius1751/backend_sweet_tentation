import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { CreateAdditionOrderDto } from './create-addition-order.dto';

import { Type } from "class-transformer";
export class CreateOfferOrderDto {

    @IsMongoId()
    public readonly offer: string;

    @IsNumber()
    @Min(1)
    public readonly cant: number;

    @IsArray({ context: CreateAdditionOrderDto })
    @Type(() => CreateAdditionOrderDto)
    @ValidateNested()
    @IsOptional()
    public readonly additions?: CreateAdditionOrderDto[];

    @IsString()
    @IsOptional()
    public readonly observations?: string;
}
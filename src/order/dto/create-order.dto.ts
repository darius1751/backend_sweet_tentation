import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSweetOrderDto } from "./create-sweet-order.dto";
import { CreateOfferOrderDto } from "./create-offer-order.dto";
import { IsNonPrimitiveArray } from "src/common/decorators/isNonPrimitive.decorator";
import { Type } from "class-transformer";

export class CreateOrderDto {

    @IsArray({ context: CreateSweetOrderDto })
    @ValidateNested({ each: true })
    @IsNonPrimitiveArray()
    @Type(() => CreateSweetOrderDto)
    @ArrayMinSize(1)
    @IsOptional()
    public readonly sweets?: CreateSweetOrderDto[];

    @IsArray({ context: CreateOfferOrderDto })
    @ValidateNested({ each: true })
    @IsNonPrimitiveArray()
    @Type(() => CreateOfferOrderDto)
    @ArrayMinSize(1)
    @IsOptional()
    public readonly offers?: CreateOfferOrderDto[];

    @IsString()
    @IsOptional()
    public readonly observations?: string;
}
import { IsMongoId, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateAdditionOrderDto } from './create-addition-order.dto';
import { IsNonPrimitiveArray } from "src/common/decorators/isNonPrimitive.decorator";

export class CreateSweetOrderDto {

    @IsMongoId()
    public readonly sweet: string;

    @IsNumber()
    @Min(1)
    public readonly cant: number;

    @ValidateNested({ each: true })
    @Type(() => CreateAdditionOrderDto)
    @IsNonPrimitiveArray()
    @IsOptional()
    public readonly additions?: CreateAdditionOrderDto[];

    @IsString()
    @IsOptional()
    public readonly observations?: string;
}
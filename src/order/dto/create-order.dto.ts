import { IsArray, IsOptional, IsString } from "class-validator";
import { CreateSweetOrderDto } from "./create-sweet-order.dto";

export class CreateOrderDto {

    @IsArray({ context: CreateSweetOrderDto })
    public readonly sweets: CreateSweetOrderDto[];

    @IsString()
    @IsOptional()
    public readonly observations?: string;
}
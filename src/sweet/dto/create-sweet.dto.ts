import { IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateSweetDto {

    @IsString()
    public readonly title: string;

    @IsNumberString({ no_symbols: true })
    public readonly price: number;

    @IsString()
    @IsOptional()
    public readonly categories?: string[];

    @IsString()
    @IsOptional()
    public readonly description?: string;

}

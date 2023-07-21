import { IsDateString, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateOfferDto {

    @IsString()
    public readonly title: string;

    @IsNumberString({ no_symbols: true })
    public readonly normalPrice: number;

    @IsNumberString({ no_symbols: true })
    public readonly newPrice: number;

    /**
     * Separation with ; 
     * and mongoId's
     * */
    @IsString()
    @IsOptional()
    public readonly categories?: string;

    /**
     * Separation with ;
     * and mongoId's 
     * */
    @IsOptional()
    @IsString()
    public readonly sweets?: string;

    @IsString()
    @IsOptional()
    public readonly description?: string;

    @IsDateString()
    public readonly limitTime: string;
}

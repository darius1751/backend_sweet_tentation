import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsDateString, IsNumberString, IsOptional, IsString, isMongoId } from "class-validator";
import { transformMongoIdArray } from "src/common/utils/transformMongoIdArray";


// import { ParseMongoIdArray } from "src/parseMongoIdArray";

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
    @IsOptional()
    @Transform(transformMongoIdArray, { toPlainOnly: true })
    public readonly categories?: string[];

    /**
     * Separation with ;
     * and mongoId's 
     * */
    @IsOptional()
    @Transform(transformMongoIdArray, { toPlainOnly: true })
    public readonly sweets?: string[];

    @IsString()
    @IsOptional()
    public readonly description?: string;

    @IsDateString()
    public readonly limitTime: string;
}

import { Transform } from "class-transformer";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { transformMongoIdArray } from "src/common/utils/transformMongoIdArray";

export class CreateSweetDto {

    @IsString()
    public readonly title: string;

    @IsNumberString({ no_symbols: true })
    public readonly price: number;

    @IsString()
    @Transform(transformMongoIdArray)
    @IsOptional()
    public readonly categories?: string[];

    @IsString()
    @IsOptional()
    public readonly description?: string;

}

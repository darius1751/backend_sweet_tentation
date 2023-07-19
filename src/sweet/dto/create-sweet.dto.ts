import { IsArray, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { MongoIdPipe } from "src/pipe/mongo-id/mongo-id.pipe";

export class CreateSweetDto {

    @IsString()
    public readonly title: string;

    @IsNumberString({ no_symbols: true })
    public readonly price: number;

    @IsArray({ context: MongoIdPipe })
    @IsOptional()
    public readonly categories?: string[];

    @IsString()
    @IsOptional()
    public readonly description?: string;

}

import { IsDateString, IsMongoId } from "class-validator";

export class CreateNoveltyDto {

    @IsMongoId()
    public readonly sweet: string;

    @IsDateString()
    public readonly limitTime: string;
}

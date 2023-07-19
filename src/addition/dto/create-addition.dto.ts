import { IsNumberString, IsString } from "class-validator";

export class CreateAdditionDto {
    
    @IsString()
    public readonly name: string;

    @IsNumberString({ no_symbols: true })
    public readonly price: number;
    
}

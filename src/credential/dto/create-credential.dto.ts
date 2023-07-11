import { IsString, Matches} from "class-validator";

export class CreateCredentialDto {
    
    @IsString()
    public readonly user: string;
    
    @IsString()
    public readonly password: string;
}
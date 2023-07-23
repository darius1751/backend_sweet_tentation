import { IsEmail, IsMongoId, IsObject, IsPhoneNumber, IsString } from "class-validator";
import { CreateCredentialDto } from "src/credential/dto/create-credential.dto";

export class CreateUserDto {

    @IsString()
    public readonly name: string;

    @IsObject({ context: CreateCredentialDto })
    public readonly credential: CreateCredentialDto;

    @IsPhoneNumber()
    public readonly phone: string;

    @IsEmail()
    public readonly email: string;

    @IsString()
    public readonly address: string;

    @IsMongoId()
    public readonly role: string;
}

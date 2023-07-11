import { IntersectionType } from "@nestjs/mapped-types";
import { CreateCredentialDto } from "./create-credential.dto";

export class LoginCredentialDto extends IntersectionType(CreateCredentialDto){}
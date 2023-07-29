import { FindRoleDto } from "src/role/dto/find-role.dto";

export class FindUserDto {

    public readonly id: string;
    public readonly name: string;
    public readonly phone: string;
    public readonly email: string;
    public readonly address: string;
    public readonly role: FindRoleDto;
    public readonly active: boolean;
}
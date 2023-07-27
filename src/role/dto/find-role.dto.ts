import { FindPermissionDto } from "src/permission/dto/find-permission.dto";

export class FindRoleDto {
    public readonly id: string;
    public readonly name: string;
    public readonly permissions: FindPermissionDto[];
}
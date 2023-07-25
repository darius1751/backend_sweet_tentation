import { ArrayMinSize, IsString } from "class-validator";
import { IsMongoIdArray } from "src/common/decorators/isMongoIdArray.decorator";

export class CreateRoleDto {

    @IsString()
    public readonly name: string;

    @IsMongoIdArray()
    @ArrayMinSize(1)
    public readonly permissions: string[];

    @IsString()
    public readonly description: string;


}

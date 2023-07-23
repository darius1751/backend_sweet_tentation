import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Permission } from "src/permission/entities/permission.entity";

@Schema({ versionKey: false })
export class Role {

    @Prop({ unique: true, required: true })
    public readonly name: string;

    @Prop({ required: true })
    public readonly description: string;

    @Prop([{ type: SchemaTypes.ObjectId, ref: Permission.name }])
    public readonly permissions: string[];
    
}

export const RoleSchema = SchemaFactory.createForClass(Role);
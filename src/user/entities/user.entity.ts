import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Role } from "src/role/entities/role.entity";

@Schema({ versionKey: false })
export class User {

    @Prop({ required: true })
    public readonly name: string;

    @Prop({ required: true })
    public readonly phone: string;

    @Prop({ unique: true, required: true })
    public readonly email: string;

    @Prop({ required: true })
    public readonly address: string;

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Role.name })
    public readonly roleId: string;

    @Prop({ unique: true, required: true, type: SchemaTypes.ObjectId, ref: Role.name })
    public readonly credentialId: string;

    @Prop({ default: true })
    public readonly active: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);

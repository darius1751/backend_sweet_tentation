import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

    @Prop({ required: true })
    public readonly roleId: string;

    @Prop({ unique: true, required: true })
    public readonly credentialId: string;

    @Prop({ default: true })
    public readonly active: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);

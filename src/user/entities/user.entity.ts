import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class User {

    @Prop()
    public readonly name: string;

    @Prop()
    public readonly phone: string;

    @Prop({ unique: true })
    public readonly email: string;

    @Prop()
    public readonly address: string;

    @Prop()
    public readonly roleId: string;

    @Prop({ unique: true })
    public readonly credentialId: string;

    @Prop({ default: true })
    public readonly active: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);

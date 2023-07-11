import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class Role {

    @Prop({ unique: true })
    public readonly name: string;

    @Prop()
    public readonly description: string;

}

export const RoleSchema = SchemaFactory.createForClass(Role);
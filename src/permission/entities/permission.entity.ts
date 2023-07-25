import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class Permission {

    @Prop({ unique: true, required: true })
    public readonly name: string;

    @Prop({ required: false })
    public readonly description: string;
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({ versionKey: false })
export class Sweet {

    @Prop({ required: true, unique: true })
    public readonly title: string;

    @Prop({ required: true, min: 0 })
    public readonly price: number;

    @Prop({ required: true })
    public readonly mainImage: string;

    @Prop({ validators: [SchemaTypes.Array] })
    public readonly images: string[];

    @Prop({ validators: [SchemaTypes.Array] })
    public readonly categories: string[];

    @Prop({ required: false })
    public readonly description: string;

    @Prop({ required: false, default: false })
    public readonly isNew: boolean;
}
export const SweetSchema = SchemaFactory.createForClass(Sweet);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Image, ImageSchema } from "./image.entity";
import { Category } from "src/category/entities/category.entity";

@Schema({ versionKey: false })
export class Sweet {

    @Prop({ required: true, unique: true })
    public readonly title: string;

    @Prop({ required: true, min: 0 })
    public readonly price: number;

    @Prop({ required: true, type: ImageSchema })
    public readonly mainImage: Image;

    @Prop([{ type: ImageSchema }])
    public readonly images: Image[];

    @Prop([{ type: SchemaTypes.ObjectId, ref: Category.name }])
    public readonly categories: string[];

    @Prop({ required: false })
    public readonly description: string;
}
export const SweetSchema = SchemaFactory.createForClass(Sweet);
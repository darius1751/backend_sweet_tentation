import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Category } from "src/category/entities/category.entity";
import { Image, ImageSchema } from "src/sweet/entities/image.entity";
import { Sweet } from "src/sweet/entities/sweet.entity";

@Schema({ versionKey: false })
export class Offer {

    @Prop({ type: ImageSchema, required: true })
    public readonly mainImage: Image;

    @Prop([{ type: ImageSchema }])
    public readonly images: Image[];

    @Prop({ required: true, unique: true })
    public readonly title: string;

    @Prop({ default: true })
    public readonly active: boolean;

    @Prop({ min: 0 })
    public readonly normalPrice: number;

    @Prop({ min: 0 })
    public readonly discount: number;

    @Prop({ min: 0 })
    public readonly newPrice: number;

    @Prop([{ type: SchemaTypes.ObjectId, ref: Sweet.name }])
    public readonly sweets: string[];

    @Prop([{ type: SchemaTypes.ObjectId, ref: Category.name }])
    public readonly categories: string[];

    @Prop({ required: false })
    public readonly description: string;

    @Prop({ type: SchemaTypes.Date, default: Date.now() })
    public readonly createdAt: string;

    @Prop({ type: SchemaTypes.Date, validators: [(date: string) => new Date(date).getDate() > Date.now()] })
    public readonly limitTime: string;
}
export const OfferSchema = SchemaFactory.createForClass(Offer);

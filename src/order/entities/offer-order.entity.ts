import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { AdditionOrder, AdditionOrderSchema, AdditionOrderType } from "./addition-order.entity";
import { Offer } from "src/offer/entities/offer.entity";

@Schema({ versionKey: false })
export class OfferOrder extends Document {

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Offer.name })
    public readonly offer: string;

    @Prop({ required: true })
    public readonly title: string;

    @Prop({ required: true, min: 0 })
    public readonly price: number;

    @Prop({ required: true, min: 1 })
    public readonly cant: number;

    @Prop([{ required: false, type: AdditionOrderSchema }])
    public readonly additions: AdditionOrder[];

    @Prop({ min: 0 })
    public readonly totalToPay: number;

    @Prop({ required: false })
    public readonly observations: string;
}

export const OfferOrderSchema = SchemaFactory.createForClass(OfferOrder);

export type OfferOrderType = {
    offer: string,
    title: string,
    price: number,
    cant: number,
    additions: AdditionOrderType[],
    totalToPay: number,
    observations?: string
}
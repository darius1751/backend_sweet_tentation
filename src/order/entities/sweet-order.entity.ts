import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AdditionOrder, AdditionOrderSchema, AdditionOrderType } from "./addition-order.entity";
import { Document, SchemaTypes } from "mongoose";
import { Sweet } from "src/sweet/entities/sweet.entity";

@Schema({ versionKey: false })
export class SweetOrder extends Document {

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Sweet.name })
    public readonly sweet: string;

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

export const SweetOrderSchema = SchemaFactory.createForClass(SweetOrder);

export type SweetOrderType = {
    sweet: string,
    title: string,
    price: number,
    cant: number,
    additions?: AdditionOrderType[],
    totalToPay: number,
    observations?: string
}
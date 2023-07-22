import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Addition } from "src/addition/entities/addition.entity";

@Schema({ versionKey: false })
export class AdditionOrder {

    @Prop({ type: SchemaTypes.ObjectId, ref: Addition.name, required: true })
    public readonly addition: string;

    @Prop({ required: true })
    public readonly name: string;

    @Prop({ min: 0, required: true })
    public readonly price: number;

    @Prop({ min: 1, required: true })
    public readonly cant: number;

    @Prop({ min: 1, required: true })
    public readonly totalToPay: number;
}
export const AdditionOrderSchema = SchemaFactory.createForClass(AdditionOrder);

export type AdditionOrderType = {
    addition: string,
    name: string,
    price: number,
    cant: number,
    totalToPay: number
}
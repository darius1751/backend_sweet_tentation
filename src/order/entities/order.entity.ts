import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { SweetOrder, SweetOrderSchema } from "./sweet-order.entity";

@Schema({ versionKey: false })
export class Order {
    
    @Prop({ required: true })
    public readonly invoiceNumber: string;
    
    @Prop({ min: 0, required: true })
    public readonly totalToPay: number;

    @Prop([{ type: SweetOrderSchema, minlength: 1 }])
    public readonly sweets: SweetOrder[];

    @Prop({ required: false })
    public readonly observations: string;

    @Prop({ type: SchemaTypes.Date, default: Date.now() })
    public readonly createdAt: string;

    @Prop({ type: SchemaTypes.Date, required: false })
    public readonly updatedAt: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);

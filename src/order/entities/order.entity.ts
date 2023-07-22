import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { SweetOrder, SweetOrderSchema } from "./sweet-order.entity";
import { OfferOrder, OfferOrderSchema } from "./offer-order.entity";
import { User } from "src/user/entities/user.entity";

@Schema({ versionKey: false })
export class Order {

    @Prop({ required: false })
    public readonly invoiceNumber: string;

    @Prop({ min: 0, required: true })
    public readonly totalToPay: number;

    @Prop([{ type: SweetOrderSchema, required: false }])
    public readonly sweets: SweetOrder[];

    @Prop([{ type: OfferOrderSchema, required: false }])
    public readonly offers: OfferOrder[];

    @Prop({ required: false, type: SchemaTypes.ObjectId, ref: User.name })
    public readonly user: string;

    @Prop({ required: false })
    public readonly observations: string;

    @Prop({ type: SchemaTypes.Date, default: Date.now() })
    public readonly createdAt: string;

    @Prop({ type: SchemaTypes.Date, required: false })
    public readonly updatedAt: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);

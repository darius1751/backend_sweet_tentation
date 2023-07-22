import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Addition } from "src/addition/entities/addition.entity";

@Schema({ versionKey: false })
export class AdditionOrder {

    @Prop({ type: SchemaTypes.ObjectId, ref: Addition.name, unique: true, required: true })
    public readonly addition: string;

    @Prop({ min: 0 })
    public readonly price: number;

    @Prop({ min: 1 })
    public readonly cant: number;
}
export const AdditionOrderSchema = SchemaFactory.createForClass(AdditionOrder);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Sweet } from "src/sweet/entities/sweet.entity";

@Schema({ versionKey: false })
export class Novelty {

    @Prop({ type: SchemaTypes.ObjectId, ref: Sweet.name, unique: true })
    public readonly sweetId: string;

    @Prop({ type: SchemaTypes.Date, default: Date.now() })
    public readonly createdAt: string;

    @Prop({ type: SchemaTypes.Boolean, default: true })
    public readonly active: boolean;

    @Prop({ type: SchemaTypes.Date, required: true })
    public readonly limitTime: string;

    @Prop({ type: SchemaTypes.Date, required: false })
    public readonly updatedAt: string;

}

export const NoveltySchema = SchemaFactory.createForClass(Novelty);
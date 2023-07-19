import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";

@Schema({ versionKey: false })
export class Image extends Document {

    @Prop({ unique: true })
    public readonly secureUrl: string;

    @Prop({ type: SchemaTypes.Date, default: Date.now() })
    public readonly createdAt: string;

    @Prop({ type: SchemaTypes.Date })
    public readonly updatedAt: string;

}
export const ImageSchema = SchemaFactory.createForClass(Image);
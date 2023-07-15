import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Image extends Document {

    @Prop({ unique: true })
    public readonly source: string;
}
export const ImageSchema = SchemaFactory.createForClass(Image);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Image, ImageSchema } from "src/sweet/entities/image.entity";

@Schema({ versionKey: false })
export class Addition {

    @Prop({ unique: true })
    public readonly name: string;

    @Prop({ required: true, min: 0 })
    public readonly price: number;

    @Prop({ type: ImageSchema })
    public readonly image: Image;


}
export const AdditionSchema = SchemaFactory.createForClass(Addition);

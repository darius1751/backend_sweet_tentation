import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class Category {

    @Prop({ unique: true, required: true })
    public readonly name: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
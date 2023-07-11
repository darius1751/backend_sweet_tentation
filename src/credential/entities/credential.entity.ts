import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Credential {
    
    @Prop({
        unique: true,
        required:true
    })
    public readonly user: string;

    @Prop({
        required:true,
    })
    public readonly password: string;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);

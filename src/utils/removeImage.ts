import { InternalServerErrorException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
export const removeImage = async (publicId: string) => {
    try{
        await cloudinary.uploader.destroy(publicId);
    }catch(exception){
        throw new InternalServerErrorException(`Error in removeImage ${exception.message}`);
    }
    
}
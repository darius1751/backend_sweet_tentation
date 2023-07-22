import { InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
export const saveImage = async (path: string, publicId: string) => {
    try {
        const { secure_url } = await cloudinary.uploader.upload(path, { public_id: publicId });
        return { secureUrl: secure_url };
    } catch (exception) {
        throw new InternalServerErrorException(`Error in saveImage ${exception.message}`);
    }

}
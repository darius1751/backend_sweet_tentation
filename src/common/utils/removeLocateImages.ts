import { unlink } from "fs/promises";

export const removeLocalImages = async (images: Express.Multer.File[]) => {
    for (const image of images) {
        const { path } = image;
        await unlink(path);
    }
}
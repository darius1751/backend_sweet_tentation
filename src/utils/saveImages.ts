import { join } from "path";
import { saveImage } from "./saveImage";

export type SaveImageLocation = {
    folder: string;
    title: string;
}
export const saveImages = async ({ folder, title }: SaveImageLocation, mainImage: Express.Multer.File, images: Express.Multer.File[]) => {
    const mainImageSecureURL = await saveImage(mainImage.path, join(folder, title, "mainImage"));
    const imagesSecureURL: { secureUrl: string }[] = [];
    if (images) {
        for (let i = 0; i < images.length; i++) {
            const { path } = images[i];
            imagesSecureURL.push(await saveImage(path, join(folder, title, `image${i + 1}`)));
        }
    }
    return { mainImageSecureURL, imagesSecureURL };
}
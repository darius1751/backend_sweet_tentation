import { BadRequestException } from "@nestjs/common";
import { extname } from "path";

export const validateFile = (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    const extensionsValid = [".gif",".png",".jpg",".jpeg",".webp",".svg"];
    const extensionFile = extname(file.originalname);
    if(extensionsValid.includes(extensionFile))
        callback(null,true);
    else
        callback(new BadRequestException(`Extension: ${extensionFile} not is valid`), false);
}
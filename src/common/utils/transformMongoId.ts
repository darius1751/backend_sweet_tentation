import { BadRequestException } from "@nestjs/common";
import { isMongoId } from "class-validator";

export const transformMongoId = ({ value }: { value: string }): string[] => {
    if (value) {
        const mongoIds = value.split(";");
        for (const mongoId of mongoIds) {
            if (!isMongoId(mongoId))
                throw new BadRequestException(`Not is a mongoId: ${mongoId}`);
        }
        return mongoIds;
    }
}
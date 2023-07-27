import { FindImageDto } from "src/sweet/dto/find-image.dto";

export class FindAdditionDto {

    public readonly id: string;

    public readonly name: string;

    public readonly price: number;

    public readonly image: FindImageDto;
}
import { FindSweetDto } from "src/sweet/dto/find-sweet-dto";

export class FindNoveltyDto {
    id: string;
    sweet: FindSweetDto;
    active: boolean;
    limitTime: string;
    createdAt: string;
    updatedAt: string;
};
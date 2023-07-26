import { FindSweetOrderDto } from "./find-sweet-order.dto";
import { FindOfferOrderDto } from "./find-offer-order.dto";

export class FindOrderDto {

    public readonly id: string;

    public readonly sweets: FindSweetOrderDto[];

    public readonly offers: FindOfferOrderDto[];

    public readonly totalToPay: number;
}
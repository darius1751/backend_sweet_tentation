import { FindAdditionOrderDto } from "./find-addition-order.dto";

export class FindOfferOrderDto{
    
    public readonly id: string;
    
    public readonly offer: string;

    public readonly title: string;

    public readonly price: number;

    public readonly cant: number;

    public readonly additions: FindAdditionOrderDto[];

    public readonly totalToPay: number;

    public readonly observations: string;

}
import { ListFormat } from "typescript";
import { Book } from "./book";
import { OrderBookItems } from "./order-book-item";

export class RentCart {
    customerId!: number;
    orderBookItems: Array<OrderBookItems>;

    constructor() {
        this.orderBookItems = new Array<OrderBookItems>();
    }
}
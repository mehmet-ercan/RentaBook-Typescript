import { ListFormat } from "typescript";
import { Book } from "./book";
import { SaleBookItems } from "./sale-book-item";

export class RentCart {
    customerId!: number;
    saleBookItems: Array<SaleBookItems>;

    constructor() {
        this.saleBookItems = new Array<SaleBookItems>();
    }
}
import { Book } from "./book";

export class SaleCart {
    customerId!: number;
    bookAndQuantityMap: Map<Book, number>;

    constructor() {
        this.bookAndQuantityMap = new Map<Book, number>();
    }
}
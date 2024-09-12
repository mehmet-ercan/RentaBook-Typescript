import { Book } from "./book";

export class RentCart {
    customerId!: number;
    bookAndQuantityMap: Map<Book, number>;

    constructor() {
        this.bookAndQuantityMap = new Map<Book, number>();
    }
}
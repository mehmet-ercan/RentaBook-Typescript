import { Book } from "./book";
import { OrderBookItems } from "./order-book-item";

export class SaleCart {
    customerId!: number;
    orderBookItems: Array<OrderBookItems>;


	constructor() {
		this.orderBookItems = new Array<OrderBookItems>;
	}





}
import { Book } from "./book";
import { SaleBookItems } from "./sale-book-item";

export class SaleCart {
    customerId!: number;
    saleBookItems: Array<SaleBookItems>;


	constructor() {
		this.saleBookItems = new Array<SaleBookItems>;
	}





}
import { Book } from "./book";
import { OrderBookItems } from "./order-book-item";

export class Sale {
    private _id:number;
    private _orderBookItems?: Array<OrderBookItems>;
    private _customerId?: number;
    private _operationDateTime?: Date;
    private _operationNumber?: string;
    private _total?: number;

	constructor(orderBookItems?: Array<OrderBookItems>, customerId?: number, operationDateTime?: Date, operationNumber?: string, total?: number) {
		this._orderBookItems = orderBookItems;
		this._customerId = customerId;
		this._operationDateTime = operationDateTime;
		this._operationNumber = operationNumber;
		this._total = total;
	}

    /**
     * Getter id
     * @return {number}
     */
	public get id(): number {
		return this._id;
	}

    /**
     * Setter id
     * @param {number} value
     */
	public set id(value: number) {
		this._id = value;
	}


    /**
     * Getter orderBookItems
     * @return {Array<OrderBookItems>}
     */
	public get orderBookItems(): Array<OrderBookItems> {
		return this._orderBookItems!;
	}

    /**
     * Getter customerId
     * @return {number}
     */
	public get customerId(): number {
		return this._customerId!;
	}

    /**
     * Getter operationDateTime
     * @return {Date}
     */
	public get operationDateTime(): Date {
		return this._operationDateTime!;
	}

    /**
     * Getter operationNumber
     * @return {string}
     */
	public get operationNumber(): string {
		return this._operationNumber!;
	}

    /**
     * Getter total
     * @return {number}
     */
	public get total(): number {
		return this._total!;
	}

    /**
     * Setter orderBookItems
     * @param {Array<OrderBookItems>} value
     */
	public set orderBookItems(value: Array<OrderBookItems>) {
		this._orderBookItems = value;
	}

    /**
     * Setter customerId
     * @param {number} value
     */
	public set customerId(value: number) {
		this._customerId = value;
	}

    /**
     * Setter operationDateTime
     * @param {Date} value
     */
	public set operationDateTime(value: Date) {
		this._operationDateTime = value;
	}

    /**
     * Setter operationNumber
     * @param {string} value
     */
	public set operationNumber(value: string) {
		this._operationNumber = value;
	}

    /**
     * Setter total
     * @param {number} value
     */
	public set total(value: number) {
		this._total = value;
	}
	
    
}
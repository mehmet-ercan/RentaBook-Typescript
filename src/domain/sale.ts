import { Book } from "./book";
import { SaleBookItems } from "./sale-book-item";

export class Sale {
    private _saleBookItems?: Array<SaleBookItems>;
    private _customerId?: number;
    private _operationDateTime?: Date;
    private _operationNumber?: string;
    private _total?: number;

    constructor(saleBookItems?: Array<SaleBookItems>, operationDateTime?: Date, customerId?: number, operationNumber?: string, total?: number) {
        this._saleBookItems = saleBookItems;
        this._operationDateTime = operationDateTime;
        this._customerId = customerId;
        this._operationNumber = operationNumber;
        this._total = total;
    }

    /**
     * Getter saleBookItems
     * @return {Array<SaleBookItems>}
     */
	public get saleBookItems(): Array<SaleBookItems> {
		return this._saleBookItems!;
	}

    /**
     * Setter saleBookItems
     * @param {Array<SaleBookItems>} value
     */
	public set saleBookItems(value: Array<SaleBookItems>) {
		this._saleBookItems = value;
	}

    /**
     * Getter operationDateTime
     * @return {Date}
     */
    public get operationDateTime(): Date {
        return this._operationDateTime!;
    }

    /**
     * Getter customerId
     * @return {number}
     */
    public get customerId(): number {
        return this._customerId!;
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
     * Setter operationDateTime
     * @param {Date} value
     */
    public set operationDateTime(value: Date) {
        this._operationDateTime = value;
    }

    /**
     * Setter customerId
     * @param {number} value
     */
    public set customerId(value: number) {
        this._customerId = value;
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
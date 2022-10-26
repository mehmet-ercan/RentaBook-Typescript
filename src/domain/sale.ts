import { Book } from "./book";

export class Sale {

    private _bookAndQuantityMap? = new Map<Book, number>();
    private _customerId?: number;
    private _operationDateTime?: Date;
    private _operationNumber?: string;
    private _total?: number;


    constructor(bookAndQuantityMap?: Map<Book, number>, operationDateTime?: Date, customerId?: number, operationNumber?: string, total?: number) {
        this._bookAndQuantityMap = bookAndQuantityMap;
        this._operationDateTime = operationDateTime;
        this._customerId = customerId;
        this._operationNumber = operationNumber;
        this._total = total;
    }


    /**
     * Getter bookAndQuantityMap
     * @return {Map<Book, number>()}
     */
    public get bookAndQuantityMap(): Map<Book, number> {
        return this._bookAndQuantityMap!;
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
     * Setter bookAndQuantityMap
     * @param {Map} value
     */
    public set bookAndQuantityMap(value: Map<Book, number>) {
        this._bookAndQuantityMap = value;
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
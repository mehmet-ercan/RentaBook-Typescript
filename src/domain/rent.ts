import { Sale } from "./sale";
import { OrderBookItems } from "./order-book-item";

export class Rent extends Sale {
    private _refundDate?: Date;
    private _refund?: number;


    constructor(saleBookItems?: Array<OrderBookItems>, operationDateTime?: Date, customerId?: number, operationNumber?: string, total?: number, refundDate?: Date, refund?: number) {
        super(saleBookItems, customerId, operationDateTime, operationNumber, total)

        this._refundDate = refundDate;
        this._refund = refund;
    }


    /**
     * Getter refundDate
     * @return {Date}
     */
    public get refundDate(): Date {
        return this._refundDate!;
    }

    /**
     * Getter refund
     * @return {number}
     */
    public get refund(): number {
        return this._refund!;
    }

    /**
     * Setter refundDate
     * @param {Date} value
     */
    public set refundDate(value: Date) {
        this._refundDate = value;
    }

    /**
     * Setter refund
     * @param {number} value
     */
    public set refund(value: number) {
        this._refund = value;
    }




}
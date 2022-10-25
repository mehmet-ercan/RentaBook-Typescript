import { Sale } from "./sale";

export class CancelSale {
    private _sale: Sale;
    private _refund: number;
    private _canceledDateTime: Date;

    constructor(sale: Sale, refund: number, canceledDateTime: Date) {
        this._sale = sale;
        this._refund = refund;
        this._canceledDateTime = canceledDateTime;
    };

    


    /**
     * Getter sale
     * @return {Sale}
     */
	public get sale(): Sale {
		return this._sale;
	}

    /**
     * Getter refund
     * @return {number}
     */
	public get refund(): number {
		return this._refund;
	}

    /**
     * Getter canceledDateTime
     * @return {Date}
     */
	public get canceledDateTime(): Date {
		return this._canceledDateTime;
	}

    /**
     * Setter sale
     * @param {Sale} value
     */
	public set sale(value: Sale) {
		this._sale = value;
	}

    /**
     * Setter refund
     * @param {number} value
     */
	public set refund(value: number) {
		this._refund = value;
	}

    /**
     * Setter canceledDateTime
     * @param {Date} value
     */
	public set canceledDateTime(value: Date) {
		this._canceledDateTime = value;
	}
    

}
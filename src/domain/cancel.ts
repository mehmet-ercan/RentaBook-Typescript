import { Sale } from "./sale";

export class Cancel {
    private _cancelType: Sale;
    private _refund: number;
    private _canceledDateTime: Date;

    constructor(cancelType: Sale, refund: number, canceledDateTime: Date) {
        this._cancelType = cancelType;
        this._refund = refund;
        this._canceledDateTime = canceledDateTime;
    };


    /**
     * Getter cancelType
     * @return {Sale}
     */
	public get cancelType(): Sale {
		return this._cancelType;
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
     * Setter cancelType
     * @param {Sale} value
     */
	public set cancelType(value: Sale) {
		this._cancelType = value;
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
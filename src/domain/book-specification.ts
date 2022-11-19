export class BookSpecification {
    private _id: number;
    private _isbn: string;
    private _price: number;
    private _startDate: Date;
    private _endDate: Date;

    constructor(isbn: string, price: number, startDate: Date, endDate: Date) {
        this._isbn = isbn;
        this._price = price;
        this._startDate = startDate;
        this._endDate = endDate;
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
     * Getter isbn
     * @return {string}
     */
    public get isbn(): string {
        return this._isbn;
    }

    /**
     * Getter price
     * @return {number}
     */
    public get price(): number {
        return this._price;
    }

    /**
     * Getter startDate
     * @return {Date}
     */
    public get startDate(): Date {
        return this._startDate;
    }

    /**
     * Getter endDate
     * @return {Date}
     */
    public get endDate(): Date {
        return this._endDate;
    }

    /**
     * Setter isbn
     * @param {string} value
     */
    public set isbn(value: string) {
        this._isbn = value;
    }

    /**
     * Setter price
     * @param {number} value
     */
    public set price(value: number) {
        this._price = value;
    }

    /**
     * Setter startDate
     * @param {Date} value
     */
    public set startDate(value: Date) {
        this._startDate = value;
    }

    /**
     * Setter endDate
     * @param {Date} value
     */
    public set endDate(value: Date) {
        this._endDate = value;
    }



}
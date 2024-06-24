export class BookPrice {
    private _id: number;
    private _price: number;
    private _startDate: Date;
    private _endDate: Date;

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
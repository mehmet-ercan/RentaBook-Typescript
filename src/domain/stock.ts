export class Stock {
    private _id:number;
    private _book_id: number;
    private _quantity: number;
    private _shelfNumber: string;



	constructor(book_id: number, quantity: number, shelfNumber: string) {
		this._book_id = book_id;
		this._quantity = quantity;
		this._shelfNumber = shelfNumber;
	}


    /**
     * Getter id
     * @return {number}
     */
	public get id(): number {
		return this._id;
	}

    /**
     * Getter book_id
     * @return {number}
     */
	public get book_id(): number {
		return this._book_id;
	}

    /**
     * Getter quantity
     * @return {number}
     */
	public get quantity(): number {
		return this._quantity;
	}

    /**
     * Getter shelfNumber
     * @return {string}
     */
	public get shelfNumber(): string {
		return this._shelfNumber;
	}

    /**
     * Setter id
     * @param {number} value
     */
	public set id(value: number) {
		this._id = value;
	}

    /**
     * Setter book_id
     * @param {number} value
     */
	public set book_id(value: number) {
		this._book_id = value;
	}

    /**
     * Setter quantity
     * @param {number} value
     */
	public set quantity(value: number) {
		this._quantity = value;
	}

    /**
     * Setter shelfNumber
     * @param {string} value
     */
	public set shelfNumber(value: string) {
		this._shelfNumber = value;
	}

    


}
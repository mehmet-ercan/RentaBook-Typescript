export class Stock {
    private _isbn: string;
    private _quantity: number;
    private _shelfNumber: string;

    constructor(isbn: string, quantity: number, shelfNumber: string) {
        this._isbn = isbn;
        this._quantity = quantity;
        this._shelfNumber = shelfNumber;
    }


    /**
     * Getter isbn
     * @return {string}
     */
	public get isbn(): string {
		return this._isbn;
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
     * Setter isbn
     * @param {string} value
     */
	public set isbn(value: string) {
		this._isbn = value;
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
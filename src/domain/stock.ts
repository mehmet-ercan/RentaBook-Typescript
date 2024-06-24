import { Book } from "./book";

export class Stock {
    private _id:number;
    private _quantity: number;
    private _shelfNumber: string;
    private _book:Book;

    constructor(isbn?: string, quantity?: number, shelfNumber?: string, book?:Book) {
        this._quantity = quantity!;
        this._shelfNumber = shelfNumber!;
        this._book=book!;
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
     * Getter book
     * @return {Book}
     */
	public get book(): Book {
		return this._book;
	}

    /**
     * Setter book
     * @param {Book} value
     */
	public set book(value: Book) {
		this._book = value;
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
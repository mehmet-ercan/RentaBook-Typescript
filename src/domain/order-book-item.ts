import { Book } from "./book";

export class OrderBookItems {
    private _book: Book;
    private _quantity: number;


    constructor(book: Book, quantity: number) {
        this._book = book;
        this._quantity = quantity;
    }

    /**
     * Getter book
     * @return {Book}
     */
    public get book(): Book {
        return this._book;
    }

    /**
     * Getter quantity
     * @return {number}
     */
    public get quantity(): number {
        return this._quantity;
    }

    /**
     * Setter book
     * @param {Book} value
     */
    public set book(value: Book) {
        this._book = value;
    }

    /**
     * Setter quantity
     * @param {number} value
     */
    public set quantity(value: number) {
        this._quantity = value;
    }

    public toJSON() {
        return {
            book: this._book,
            quantity: this._quantity,
        }
    }
}
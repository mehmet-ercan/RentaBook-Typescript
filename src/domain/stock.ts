export class Stock {
    isbn: string;
    quantity: number;
    shelfNumber: string;

    constructor(isbn: string, quantity: number, shelfNumber: string) {
        this.isbn = isbn;
        this.quantity = quantity;
        this.shelfNumber = shelfNumber;
    }

}
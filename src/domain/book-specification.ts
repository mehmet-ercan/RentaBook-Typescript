export class BookSpecification {
    isbn: string;
    price: number;
    startDate: Date;
    endDate: Date;

    constructor(isbn: string, price: number, startDate: Date, endDate: Date) {
        this.isbn = isbn;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
import { Book } from "../domain/book";

export class DataBase {
    
  books: Array<Book>;
  stocks: Array<Book>;
  customers: Array<Book>;
  sales: Array<Book>;
  rents: Array<Book>;
  bookSpecifications: Array<Book>;

  constructor() {
    this.books = new Array<Book>();
    this.stocks = new Array<Book>();
    this.customers = new Array<Book>();
    this.sales = new Array<Book>();
    this.rents = new Array<Book>();
    this.bookSpecifications = new Array<Book>();
  }
}

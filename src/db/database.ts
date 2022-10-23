import { Book } from "../domain/book";
import { Customer } from "../domain/customer";
import { Stock } from "../domain/stock";

export class DataBase {
    
  books: Array<Book>;
  stocks: Array<Stock>;
  customers: Array<Customer>;
  sales: Array<Book>;
  rents: Array<Book>;
  bookSpecifications: Array<Book>;

  constructor() {
    this.books = new Array<Book>();
    this.stocks = new Array<Stock>();
    this.customers = new Array<Customer>();
    this.sales = new Array<Book>();
    this.rents = new Array<Book>();
    this.bookSpecifications = new Array<Book>();
  }
}

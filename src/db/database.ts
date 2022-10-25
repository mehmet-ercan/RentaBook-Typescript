import { Book } from "../domain/book";
import { BookSpecification } from "../domain/book-specification";
import { CancelSale } from "../domain/cancaled-sale";
import { Customer } from "../domain/customer";
import { Rent } from "../domain/rent";
import { Sale } from "../domain/sale";
import { Stock } from "../domain/stock";

export class DataBase {
    
  private _books: Array<Book>;
  private _stocks: Array<Stock>;
  private _customers: Array<Customer>;
  private _sales: Array<Sale>;
  private _rents: Array<Rent>;
  private _bookSpecifications: Array<BookSpecification>;
  private _cancelSales: Array<CancelSale>;

  constructor() {
    this._books = new Array<Book>();
    this._stocks = new Array<Stock>();
    this._customers = new Array<Customer>();
    this._sales = new Array<Sale>();
    this._rents = new Array<Rent>();
    this._bookSpecifications = new Array<BookSpecification>();
    this._cancelSales= new Array<CancelSale>();
  }

    /**
     * Getter books
     * @return {Array<Book>}
     */
	public get getBooksList(): Array<Book> {
		return this._books;
	}

    /**
     * Getter stocks
     * @return {Array<Stock>}
     */
	public get getStocksList(): Array<Stock> {
		return this._stocks;
	}

    /**
     * Getter customers
     * @return {Array<Customer>}
     */
	public get getCustomersList(): Array<Customer> {
		return this._customers;
	}

    /**
     * Getter sales
     * @return {Array<Sale>}
     */
	public get getSalesList(): Array<Sale> {
		return this._sales;
	}

    /**
     * Getter rents
     * @return {Array<Rent>}
     */
	public get getRents(): Array<Rent> {
		return this._rents;
	}

    /**
     * Getter bookSpecifications
     * @return {Array<BookSpecification>}
     */
	public get getBookSpecifications(): Array<BookSpecification> {
		return this._bookSpecifications;
	}

    /**
     * Getter cancelSales
     * @return {Array<CancelSale>}
     */
	public get getCancaledSales(): Array<CancelSale> {
		return this._cancelSales;
	}

  
}

import { Book } from "../domain/book";
import { BookPrice } from "../domain/book-price";
import { Cancel } from "../domain/cancel";
import { Customer } from "../domain/customer";
import { Rent } from "../domain/rent";
import { RentCart } from "../domain/rent-cart";
import { Sale } from "../domain/sale";
import { SaleCart } from "../domain/sale-cart";
import { Stock } from "../domain/stock";

export class DataBase {

     private _books: Array<Book>;//
     private _stocks: Array<Stock>;
     private _customers: Array<Customer>;//
     private _sales: Array<Sale>;//
     private _rents: Array<Rent>;
     private _bookSpecifications: Array<BookPrice>;
     private _cancels: Array<Cancel>;//
     private _saleCart: SaleCart;
     private _rentCart:RentCart;

     constructor() {
          this._books = new Array<Book>();
          this._stocks = new Array<Stock>();
          this._customers = new Array<Customer>();
          this._sales = new Array<Sale>();
          this._rents = new Array<Rent>();
          this._bookSpecifications = new Array<BookPrice>();
          this._cancels = new Array<Cancel>();
          this._saleCart = new SaleCart();
          this._rentCart = new RentCart;
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
      * @return {Array<BookPrice>}
      */
     public get getBookSpecifications(): Array<BookPrice> {
          return this._bookSpecifications;
     }

     /**
      * Getter cancelSales
      * @return {Array<CancelSale>}
      */
     public get getCancaledSales(): Array<Cancel> {
          return this._cancels;
     }

     /**
      * Getter saleCart
      * @return {Array<SaleCart>}
      */
     public get getSaleCart(): SaleCart {
          return this._saleCart;
     }

         /**
     * Getter rentCart
     * @return {RentCart}
     */
	public get getRentCart(): RentCart {
		return this._rentCart;
	}

    /**
     * Setter saleCart
     * @param {SaleCart} value
     */
	public set setSaleCart(value: SaleCart) {
		this._saleCart = value;
	}




    /**
     * Setter rentCart
     * @param {RentCart} value
     */
	public set setRentCart(value: RentCart) {
		this._rentCart = value;
	}
     


}

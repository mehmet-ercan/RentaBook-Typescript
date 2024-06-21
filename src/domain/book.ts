import { BookSpecification } from "./book-specification";

export class Book {
     private _id: number;
     private _isbn: string;
     private _name: string;
     private _author: string;
     private _publishYear: string;
     private _pages: number;
     private _bookSpecification: BookSpecification;

     constructor(isbn: string, name: string, author: string, publishYear: string, pages: number, bookSpecification: BookSpecification) {
          this._name = name;
          this._author = author;
          this._isbn = isbn;
          this._publishYear = publishYear;
          this._pages = pages;
          this._bookSpecification = bookSpecification;
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
      * Getter isbn
      * @return {string}
      */
     public get isbn(): string {
          return this._isbn;
     }

     /**
      * Getter name
      * @return {string}
      */
     public get name(): string {
          return this._name;
     }

     /**
      * Getter author
      * @return {string}
      */
     public get author(): string {
          return this._author;
     }

     /**
      * Getter publishYear
      * @return {string}
      */
     public get publishYear(): string {
          return this._publishYear;
     }

     /**
      * Getter pages
      * @return {number}
      */
     public get pages(): number {
          return this._pages;
     }

     /**
      * Getter bookSpecification
      * @return {BookSpecification}
      */
     public get bookSpecification(): BookSpecification {
          return this._bookSpecification;
     }

     /**
      * Setter isbn
      * @param {string} value
      */
     public set isbn(value: string) {
          this._isbn = value;
     }

     /**
      * Setter name
      * @param {string} value
      */
     public set name(value: string) {
          this._name = value;
     }

     /**
      * Setter author
      * @param {string} value
      */
     public set author(value: string) {
          this._author = value;
     }

     /**
      * Setter publishYear
      * @param {string} value
      */
     public set publishYear(value: string) {
          this._publishYear = value;
     }

     /**
      * Setter pages
      * @param {number} value
      */
     public set pages(value: number) {
          this._pages = value;
     }

     /**
      * Setter bookSpecification
      * @param {BookSpecification} value
      */
     public set bookSpecification(value: BookSpecification) {
          this._bookSpecification = value;
     }
}

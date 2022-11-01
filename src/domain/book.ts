import { BookSpecification } from "./book-specification";

export class Book {
  private _isbn: string;
  private _name: string;
  private _author: string;
  private _publishYear: string;
  private _pages: number;
  private _bookSpec: BookSpecification;

  constructor(isbn: string, name: string, author: string, publishYear: string, pages: number, bookSpec: BookSpecification) {
    this._name = name;
    this._author = author;
    this._isbn = isbn;
    this._publishYear = publishYear;
    this._pages = pages;
    this._bookSpec = bookSpec;
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
     * Getter bookSpec
     * @return {BookSpecification}
     */
	public get bookSpec(): BookSpecification {
		return this._bookSpec;
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
     * Setter bookSpec
     * @param {BookSpecification} value
     */
	public set bookSpec(value: BookSpecification) {
		this._bookSpec = value;
	}
  

}

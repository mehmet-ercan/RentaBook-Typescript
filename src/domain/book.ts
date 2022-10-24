import { BookSpecification } from "./book-specification";

export class Book {
  isbn: string;
  name: string;
  author: string;
  publishYear: string;
  pages: number;
  bookSpec: BookSpecification;

  constructor(isbn: string, name: string, author: string, publishYear: string, pages: number, bookSpec: BookSpecification) {
    this.name = name;
    this.author = author;
    this.isbn = isbn;
    this.publishYear = publishYear;
    this.pages = pages;
    this.bookSpec = bookSpec;
  }

  get _name() {
    return this.name;
  }

  set _name(value) {
    this.name = value;
  }
}

export class Book {
  isbn: string;
  name: string;
  author: string;
  publishYear: string;
  pages: number;

  constructor(isbn: string, name: string, author: string, publishYear: string, pages: number) {
    this.name = name;
    this.author = author;
    this.isbn = isbn;
    this.publishYear = publishYear;
    this.pages = pages;
  }

  get _name() {
    return this.name;
  }

  set _name(value) {
    this.name = value;
  }
}

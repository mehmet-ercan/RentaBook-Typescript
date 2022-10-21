class Book {
  _isbn: string;
  _name: string;
  _author: string;
  _publishYear: string;
  _pages: number;

  constructor(isbn: string, name: string, author: string, publishYear: string, pages: number) {
    this._name = name;
    this._author = author;
    this._isbn = isbn;
    this._publishYear = publishYear;
    this._pages = pages;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}

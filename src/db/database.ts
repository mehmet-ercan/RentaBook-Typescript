class DataBase {
    _books: Array<Book>;
    _stocks: Array<Book>;
    _customers: Array<Book>;
    _sales: Array<Book>;
    _rents: Array<Book>;
    _bookSpecifications: Array<Book>;

    constructor() {
        this._books = new Array<Book>();
        this._stocks = new Array<Book>();
        this._customers = new Array<Book>();
        this._sales = new Array<Book>();
        this._rents = new Array<Book>();
        this._bookSpecifications = new Array<Book>();
    }


}

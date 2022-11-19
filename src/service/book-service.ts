/**
 * @author Mehmet E. Akcan - 21.10.22
 */
import { bookService, stockService } from "..";
import { Book } from "../domain/book";
import { BookSpecification } from "../domain/book-specification";

export class BookService {
    private _bookList: Array<Book>;
    private _bookSpecification: Array<BookSpecification>;
    bookApi: string = 'http://localhost:3002/api/v1/books';

    constructor(bookList: Array<Book>, bookSpecification: Array<BookSpecification>) {
        this._bookList = bookList;
        this._bookSpecification = bookSpecification;
    }

    /**
     * Getter bookList
     * @return {Array<Book>}
     */
    public get bookList(): Array<Book> {
        return this._bookList;
    }

    /**
     * Getter bookSpecification
     * @return {Array<BookSpecification>}
     */
    public get bookSpecification(): Array<BookSpecification> {
        return this._bookSpecification;
    }

    /**
     * Setter bookList
     * @param {Array<Book>} value
     */
    public set bookList(value: Array<Book>) {
        this._bookList = value;
    }

    /**
     * Setter bookSpecification
     * @param {Array<BookSpecification>} value
     */
    public set bookSpecification(value: Array<BookSpecification>) {
        this._bookSpecification = value;
    }

    public getBook(id: number): Book {
        let bookSpecification = new BookSpecification("123-45", 123, new Date(), new Date());
        let book = new Book("123-45", "a", "a", "2022", 123, bookSpecification);
        return book;
    }

    async getBooks() {

        const response = await fetch(this.bookApi, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
        }
        const result = (await response.json());
        const getResult = <Book[]>JSON.parse(JSON.stringify(result, null, 4));

        return getResult as Array<Book>;

    }

    async initializeDataMock() {

        bookService.getBooks();

        console.log(this.bookList);

    }

    public listBooks() {

        const listBooksDiv = document.getElementById("listBooks");

        if (listBooksDiv) {
            let row, column;

            while (listBooksDiv.lastChild && listBooksDiv.children.length > 1) {
                listBooksDiv.removeChild(listBooksDiv.lastChild);
            }

            this.initializeDataMock();

            this.bookList.forEach(element => {
                row = document.createElement("div");
                row.className = "row-list-book";

                column = document.createElement("div");
                column.className = "column-list-book";
                column.textContent = element.isbn.toString();
                row.appendChild(column);

                column = document.createElement("div");
                column.className = "column-list-book";
                column.textContent = element.name.toString();
                row.appendChild(column);

                column = document.createElement("div");
                column.className = "column-list-book";
                column.textContent = element.author.toString();
                row.appendChild(column);

                column = document.createElement("div");
                column.className = "column-list-book";
                column.textContent = stockService.getStockQuantity(element.id).toString();
                row.appendChild(column);

                column = document.createElement("div");
                column.className = "column-list-book";
                column.textContent = element.bookSpecification.price.toString() + " ₺";
                row.appendChild(column);

                listBooksDiv.appendChild(row);
            });


        }

    }

    async addBookMock(b: Book) {
        try {
            const response = await fetch(this.bookApi, {
                method: 'POST',
                body: JSON.stringify({
                    isbn: b.isbn,
                    name: b.name,
                    author: b.author,
                    pages: b.pages,
                    publishYear: b.publishYear,
                    bookSpecification: {
                        isbn: b.bookSpecification.isbn,
                        price: b.bookSpecification.price,
                        startDate: b.bookSpecification.startDate,
                        endDate: b.bookSpecification.endDate
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const result = (await response.json());
                console.log("Rest servisinden dönen cevap =>");
                console.log(result);
                return true;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }
        } catch (Exception) {
            console.log('Hata Oluştu.');
        }
    }
}
/**
 * @author Mehmet E. Akcan - 21.10.22
 */
import { stockService } from "..";
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

    /**
     * parametre olarak gelen isbn bilgisine göre ilgili kitabı bulur.
     * @param isbn Bulunacak olan kitabın isbn numarası
     * @returns isbn numarasına göre ilgili kitabı Book nesnesi olarak geri döndürür
     */
    public getBook(isbn: string): Book {
        //Buradan null bir değer de dönebileceği için hata veriyor
        //ama biz sondaki ! operatörü ile null değer dönmeyecek diye garanti veriyoruz
        return this.bookList.find(b => b.isbn === isbn)!;
    }

    /**
     * Parametre olarak gelen Book nesnesini kitap nesnesine ekler
     * @param newBook eklenecek olan kitap nesnesi
     */
    public addBook(newBook: Book) {
        try {
            this.bookList.push(newBook);
            this.bookSpecification.push(newBook.bookSpecification);
        } catch (Exception) {
            console.log("Kitap eklenirken bir hata meydana geldi.");
        }
    }

    public isValidBook(isbn: string): boolean {
        const b = this.getBook(isbn);
        return this.bookList.includes(b)
    }

    async initializeDataMock() {
        try {
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
            this.bookList = getResult as Array<Book>;
        } catch (error) {
            console.error(error);
        }
    }

    public listBooks() {
        const listBooksDiv = document.getElementById("listBooks");

        if (listBooksDiv) {
            let row, column;

            while (listBooksDiv.lastChild && listBooksDiv.children.length > 1) {
                listBooksDiv.removeChild(listBooksDiv.lastChild);
            }

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
                column.textContent = stockService.getStockQuantity(element.isbn).toString();
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
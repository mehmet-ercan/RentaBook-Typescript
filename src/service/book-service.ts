/**
 * @author Mehmet E. Akcan - 21.10.22
 */
import { stockService } from "..";
import { Book } from "../domain/book";
import { BookPrice } from "../domain/book-price";

const BOOK_API: string = 'http://localhost:3002/api/v1/books';

export class BookService {
    private _bookList: Array<Book>;
    private _bookSpecification: Array<BookPrice>;

    constructor(bookList: Array<Book>, bookSpecification: Array<BookPrice>) {
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
     * @return {Array<BookPrice>}
     */
    public get bookSpecification(): Array<BookPrice> {
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
     * @param {Array<BookPrice>} value
     */
    public set bookSpecification(value: Array<BookPrice>) {
        this._bookSpecification = value;
    }

    /**
     * parametre olarak gelen isbn bilgisine göre ilgili kitabı bulur.
     * @param isbn Bulunacak olan kitabın isbn numarası
     * @returns isbn numarasına göre ilgili kitabı Book nesnesi olarak geri döndürür
     */
    public async getBook(isbn: string): Promise<Book> {
        const response = await fetch(BOOK_API + "/q?isbn=" + isbn, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        if (!response.ok) {
            return null as any;
            //throw new Error(`Aranan kitap bulunamadı, hata kodu:, ${response.status}`);
        }

        const result = (await response.json());
        const getResult = <Book>result;
        return getResult;
    }

    public async getAllBooksData(): Promise<Array<Book>> {
        const response = await fetch(BOOK_API, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
        }
        const result = await response.json();
        const getResult = <Array<Book>>result;
        return getResult;
    }

    public async createBook(b: Book) {
        const response = await fetch(BOOK_API, {
            method: 'POST',
            body: JSON.stringify({
                isbn: b.isbn,
                name: b.name,
                author: b.author,
                pages: b.pages,
                publishYear: b.publishYear,
                bookPriceCreateDto: {
                    price: b.bookPrice.price
                }
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
        }

        const result = await response.json();
        console.log("Rest servisinden dönen cevap =>");
        console.log(result);
        this.bookList = await this.getAllBooksData();
    }
}
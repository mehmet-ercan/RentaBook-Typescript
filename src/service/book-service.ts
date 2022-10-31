import { DataBase } from "../db/database";
import { Book } from "../domain/book";

export class BookService {
    private _dataBase: DataBase;

    constructor(dataBase: DataBase) {
        this._dataBase = dataBase;
    }

    /**
     * Getter dataBase
     * @return {DataBase}
     */
    public get dataBase(): DataBase {
        return this._dataBase;
    }

    /**
     * Setter dataBase
     * @param {DataBase} value
     */
    public set dataBase(value: DataBase) {
        this._dataBase = value;
    }

    public getBook(isbn: string): Book {
        //Buradan null bir değer de dönebileceği için hata veriyor
        //ama biz sondaki ! operatörü ile null değer dönmeyecek diye garanti veriyoruz
        return this.dataBase.getBooksList.find(b => b.isbn === isbn)!;
    }

    public addBook(newBook: Book) {
        try {
            this.dataBase.getBooksList.push(newBook);
            this.dataBase.getBookSpecifications.push(newBook.bookSpec);
        } catch (Exception) {
            console.log("Kitap eklenirken bir hata meydana geldi.");
        }
    }

    public isValidBook(isbn: string): boolean {
        const b = this.getBook(isbn);
        return this.dataBase.getBooksList.includes(b)
    }

    public initializeBooksMock() {
        getInitializeBooksMock();
    }

    public addBookMock(b: Book) {
        console.log(b.isbn);
        postAddBookMock(b);
    }
}

async function getInitializeBooksMock() {
    try {
        const response = await fetch('http://localhost:3002/api/books', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
        }

        const result = (await response.json()) as Book[];
        console.log(result);

    } catch (Exception) {
        console.log('Hata Oluştu.');
    }
}

async function postAddBookMock(b: Book) {
    try {
        const response = await fetch('http://localhost:3002/api/books/' + b.isbn, {
            method: 'POST',
            body: JSON.stringify({
                isbn: b.isbn,
                name: b.name,
                author: b.author,
                pages: b.pages,
                publishYear: b.publishYear
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
        }

        const result = (await response.json());
        console.log(result);

    } catch (Exception) {
        console.log('Hata Oluştu.');
    }
}
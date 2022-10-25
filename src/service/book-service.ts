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

    public addBook(newBook: Book): boolean {

        try {
            this.dataBase.getBooksList.push(newBook);

            this.dataBase.getBookSpecifications.push(newBook.bookSpec);
            return true;
        } catch (Exception) {
            // System.out.println("Hata kodu:" + Exception.getMessage() + "\n");
            return false;
        }
    }

    public isValidBook(isbn: string): boolean {
        const b = this.getBook(isbn);
        return this.dataBase.getBooksList.includes(b)
    }



}
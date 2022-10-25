import { DataBase } from "../db/database";
import { Stock } from "../domain/stock";

export class StockService {
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

    /**
     * Kitap henüz eklendikten sonra hemen giriyor,
     * Elimizde hiç stock kaydı/nesnesi yok, yeni kayıt/nesne oluşturuyoruz
     * Yeni eklenen kitaba stok ekleme işlemi
     * @param isbn  stok eklenecek olan kitabın isbn numarası
     */
    public addStock(isbn: string, shelfNumber: string, quantity: number): boolean {
        try {

            let newStock = new Stock(isbn, quantity, shelfNumber);
            this.dataBase.getStocksList.push(newStock);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Kitap zaten ekli, halihazırda var, daha sonra yeni kitaplar geldi,stok artırma işlemi,
     * @param isbn stok eklenecek olan kitabın isbn numarası
     * @param quantity stok eklenecek olan kitabın adedi
     * @returns işlem gerçekleşmesi durumunda true, diğer durumda false döner
     */
    //
    public increaseStock(isbn: string, quantity: number): boolean {
        let stock = this.getStock(isbn);
        if (stock) {
            stock.quantity = (stock.quantity + quantity);
            return true;
        } else {
            return false;
        }
    }

    /**
     * stock nesnesini geri döndürür
     * @param isbn stock nesnesi getirilecek olan nesnenin isbn nosu,
     * @returns db olan stock nesnensi geri döner, db de yok ise throw ile hata fırlatırlır
     */
    public getStock(isbn: string): Stock {
        let stock = this.dataBase.getStocksList.find(s => s.isbn === isbn);
        if (stock) {
            return stock;
        }
        throw new Error('');
    }

}
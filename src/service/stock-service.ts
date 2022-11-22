import { Book } from "../domain/book";
import { Stock } from "../domain/stock";

export class StockService {
    private _stockList: Array<Stock>;
    private stockApi: string = "http://localhost:3002/api/v1/stocks";

    constructor(stockList: Array<Stock>) {
        this._stockList = stockList;
    }

    /**
     * Getter stockList
     * @return {Array<Stock>}
     */
    public get stockList(): Array<Stock> {
        return this._stockList;
    }

    /**
     * Setter stockList
     * @param {Array<Stock>} value
     */
    public set stockList(value: Array<Stock>) {
        this._stockList = value;
    }

    /** !attention, *important, ?question, TODO
     * ! Öncelikle increaseStock fonksiyonundan farklı bir iş yapıyor,
     * * Kitap henüz eklendikten sonra hemen giriyor,
     * ? Kitap ilk defa eklendiyse bu fonksiyon mu çalışacak ? EVET.
     * TODO increaseStock fonksiyonunu incele
     * Elimizde hiç stock kaydı/nesnesi yok, yeni kayıt/nesne oluşturuyoruz
     * Yeni eklenen kitaba stok ekleme işlemi
     * @param isbn  stok eklenecek olan kitabın isbn numarası
     * @param shelfNumber stok eklenecek olan kitabın raf numarası
     * @param quantity kitapdan kaç adet stoğa eklenecek
     */
    public addStock(isbn: string, shelfNumber: string, quantity: number): boolean {
        try {
            let newStock = new Stock(isbn, quantity, shelfNumber);
            this.stockList.push(newStock);
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
    public increaseStock(id: number, quantity: number): boolean {
        let stock = this.getStock(id);

        if (stock) {
            stock.quantity = (stock.quantity + quantity);
            return true;
        } else {
            return false;
        }
    }

    public getStockQuantity(bookId:number): Number {
        let s: Stock | undefined = this.stockList.find(st => st.book.id === bookId);
        console.log(s);

        if (s !== undefined) {
            return s.quantity;
        } else {
            return 0;
        }
    }

    /**
     * stock nesnesini geri döndürür
     * @param isbn stock nesnesi getirilecek olan nesnenin isbn nosu,
     * @returns db olan stock nesnensi geri döner, db de yok ise throw ile hata fırlatırlır
     */
     async getStock(bookId: number):Promise<Stock> {
        let stock = this.stockList.find(s => s.book.id === bookId);
        
        if (stock) {
            return stock;
        }
        return stock;
    }

    /**
     * Eğer stok nesnesi yok ise stok nesnesi, belirtilen adet kadar stok bilgisi ile beraber ekleniyor.
     * İşte bu oluşturma/create işlemi burada yapılıyor.
     * @param s index.ts dosyasından gelen stok nesnesi
     */
    async createStock(s: Stock, b: Book): Promise<Boolean | undefined> {
        try {
            const response = await fetch(this.stockApi + "/" + b.id, {
                method: 'POST',
                body: JSON.stringify({
                    quantity: s.quantity,
                    shelfNumber: s.shelfNumber,
                    book: b
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const result = (await response.json());
                console.log(result);
                return true;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }
        } catch (error) {
            console.log('Hata Oluştu.' + error);
        }
    }

    async getAllStocksData(): Promise<Array<Stock>> {
        const response = await fetch(this.stockApi, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
        }
        const result = (await response.json());
        const getResult = <Array<Stock>>JSON.parse(JSON.stringify(result, null, 4));
        return getResult;
    }

    /**
     * Stok eklenirken eğer stok nesnesi daha önceden var ise, stok artırımını put ile yapacağız
     * @param s index.ts dosyasından gelen stok nesnesi
     */
    async increaseStockMock(s: Stock) {
        try {

            const response = await fetch(this.stockApi + "/" + s.id, {
                method: 'PUT',
                body: JSON.stringify({
                    quantity: s.quantity,
                    shelfNumber: s.shelfNumber,
                    book:s.book
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
            console.log(response.status);
        } catch (Exception) {
            console.log('Hata Oluştu.');
        }
    }
}
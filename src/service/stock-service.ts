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

    /**
     * stock nesnesini geri döndürür
     * @param isbn stock nesnesi getirilecek olan nesnenin isbn nosu,
     * @returns db olan stock nesnensi geri döner, db de yok ise throw ile hata fırlatırlır
     */
    public async getStockByBookId(bookId: number): Promise<Stock> {
        try {
            const response = await fetch(this.stockApi + "/q?bookId=" + bookId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
            });

            if (response.ok) {
                const result = (await response.json());
                return <Stock>result;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
            } else {
                console.log('unexpected error: ', error);
            }

            return null as any;
        }
    }

    /**
     * Eğer stok nesnesi yok ise stok nesnesi, belirtilen adet kadar stok bilgisi ile beraber ekleniyor.
     * İşte bu oluşturma/create işlemi burada yapılıyor.
     * @param s index.ts dosyasından gelen stok nesnesi
     */
     public async createStock(s: Stock): Promise<Boolean | undefined> {
        try {
            const response = await fetch(this.stockApi, {
                method: 'POST',
                body: JSON.stringify({
                    quantity: s.quantity,
                    shelfNumber: s.shelfNumber,
                    book: s.book
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

    public async getAllStocksData(): Promise<Array<Stock>> {
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
    
}
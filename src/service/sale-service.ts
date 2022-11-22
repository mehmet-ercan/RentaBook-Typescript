import { stockService } from "..";
import { Book } from "../domain/book";
import { Sale } from "../domain/sale";
import { OrderBookItems } from "../domain/order-book-item";
import { SaleCart } from "../domain/sale-cart";

export class SaleService {
    private _saleList: Array<Sale>;
    private _saleCart: SaleCart;
    public saleApi = 'http://localhost:3002/api/v1/sales';

    constructor(saleList: Array<Sale>, saleCart: SaleCart) {
        this._saleList = saleList;
        this._saleCart = saleCart;
    }

    /**
     * Getter saleList
     * @return {Array<Sale>}
     */
    public get saleList(): Array<Sale> {
        return this._saleList;
    }

    /**
     * Setter saleList
     * @param {Array<Sale>} value
     */
    public set saleList(value: Array<Sale>) {
        this._saleList = value;
    }

    /**
     * Getter saleCart
     * @return {Array<SaleCart>}
     */
    public get saleCart(): SaleCart {
        return this._saleCart;
    }

    /**
     * Setter saleCart
     * @param {Array<SaleCart>} value
     */
    public set saleCart(value: SaleCart) {
        this._saleCart = value;
    }

    public addSale(sale: Sale): void {
        this.saleList.push(sale);

    }

    calculateTotal(sale: Sale): number {
        let subTotal = 0.0;

        for (let entry of sale.orderBookItems) {
            subTotal += entry.book.bookPrice.price * entry.quantity;
        }

        return subTotal;
    }

    generateSaleNumber(customerId: number): string {
        let today = new Date();
        let receiptNumber: string = "S" + today.getDay().toString() + today.getMonth().toString() + today.getFullYear().toString() + today.getHours().toString() + today.getMinutes().toString() + today.getSeconds().toString() + customerId.toString();

        return receiptNumber;
    }

    public getSale(saleNumber: string): Sale {
        let sale = this.saleList.find(s => s.operationNumber === saleNumber);
        return sale!;
    }

    public removeSale(sale: Sale) {
        let index = this.saleList.indexOf(sale);
        this.saleList.splice(index, 1);
    }

    public addBookToCart(book: Book, quantity: number, customerId: number) {

        if (this.saleCart.orderBookItems.length === 0) {
            this.saleCart.customerId = customerId;
        } else if (this.saleCart.orderBookItems.length > 0) {
            if (this.saleCart.customerId !== customerId) {
                alert("Farklı müşteriye kitap satılmaya çalışılıyor. Lütfen tek müşteri için işlem yapınız");
                return false;
            }
        }
        let orderBookItems: OrderBookItems = new OrderBookItems(book, quantity);
        this.saleCart.orderBookItems.push(orderBookItems);
        this.updateSaleCart();
    }

    public updateSaleCart() {
        const saleCart = document.getElementById("saleCart");
        const subTotalSpan = document.getElementById("totalSaleAmountTl");

        if (saleCart) {

            let row, column, subTotal: number = 0;

            while (saleCart.lastChild && saleCart.children.length > 1) {
                saleCart.removeChild(saleCart.lastChild);
            }
            subTotalSpan!.textContent = "";

            for (let index = 0; index < this.saleCart.orderBookItems.length; index++) {

                row = document.createElement("div");
                row.className = "sale-cart-row";

                for (let item of this.saleCart.orderBookItems) {

                    column = document.createElement("div");
                    column.className = "sale-cart-column";
                    column.textContent = this.saleCart.customerId.toString();
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "sale-cart-column";
                    column.textContent = item.book.name;
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "sale-cart-column";
                    column.textContent = item.quantity.toString();
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "sale-cart-column";
                    column.textContent = (item.book.bookPrice.price * item.quantity).toString();
                    row.appendChild(column);
                }
            }

            if (row && subTotalSpan) {

                for (let t of this.saleCart.orderBookItems) {
                    subTotal += t.book.bookPrice.price * t.quantity;
                }

                saleCart.appendChild(row);
                subTotalSpan.textContent = subTotal.toString() + " TL";
            }
        }
    }

    public cartToSale(): any {
        let saleCart: SaleCart = this.saleCart;
        let sale = new Sale();

        sale.orderBookItems = saleCart.orderBookItems;
        sale.customerId = saleCart.customerId;
        sale.operationNumber = this.generateSaleNumber(saleCart.customerId);
        sale.operationDateTime = new Date();
        sale.total = this.calculateTotal(sale);

        for (let q of sale.orderBookItems) {
            stockService.increaseStock(q.book.isbn, - q.quantity)
        }

        let success = this.createSale(sale);
        this.saleCart = new SaleCart(); // sepeti boşalt
        this.updateSaleCart();
        return success;
    }

    async createSale(s: Sale) {
        try {
            const response = await fetch(this.saleApi, {
                method: 'POST',
                body: JSON.stringify({
                    orderBookItems: Array.from(s.orderBookItems),
                    customerId: s.customerId,
                    operationDateTime: s.operationDateTime,
                    operationNumber: s.operationNumber,
                    total: s.total
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            console.log(response);

            if (response.ok) {
                const result = (await response.json());
                console.log("Rest apidan dönen cevap:\n");
                console.log(result);
                alert("Kitap satış işlemi başarıyla gerçekleşmiştir.");
                alert("Fişinizi kaybetmeyiniz. Fiş Numarası: " + s.operationNumber);
                return true;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }

        } catch (Exception) {
            console.log('Hata Oluştu.');
        }
    }

    async isExistSale(operationNumber: string): Promise<boolean> {
        const response = await fetch(this.saleApi + "/" + operationNumber, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        console.log(response);

        if (response.ok) {
            const result = (await response.json());
            console.log("Rest apidan dönen cevap:\n");
            console.log(result);
            return true;
        } else {
            return false;
        }
    }

}

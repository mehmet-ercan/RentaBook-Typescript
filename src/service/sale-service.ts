import { stockService } from "..";
import { Book } from "../domain/book";
import { Sale } from "../domain/sale";
import { SaleBookItems } from "../domain/sale-book-item";
import { SaleCart } from "../domain/sale-cart";

export class SaleService {
    private _saleList: Array<Sale>;
    private _saleCart: SaleCart;
    public saleApi = 'http://localhost:3002/api/sales';

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

        for (let entry of sale.saleBookItems) {
            subTotal += entry.book.bookSpecification.price * entry.quantity;
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

        if (this.saleCart.saleBookItems.length === 0) {
            this.saleCart.customerId = customerId;
        } else if (this.saleCart.saleBookItems.length > 0) {
            if (this.saleCart.customerId !== customerId) {
                alert("Farklı müşteriye kitap satılmaya çalışılıyor. Lütfen tek müşteri için işlem yapınız");
                return false;
            }
        }
        let saleBookItems: SaleBookItems = new SaleBookItems(book, quantity);
        this.saleCart.saleBookItems.push(saleBookItems);
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

            for (let index = 0; index < this.saleCart.saleBookItems.length; index++) {

                row = document.createElement("div");
                row.className = "sale-cart-row";

                for (let item of this.saleCart.saleBookItems) {

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
                    column.textContent = (item.book.bookSpecification.price * item.quantity).toString();
                    row.appendChild(column);
                }
            }

            if (row && subTotalSpan) {

                for (let t of this.saleCart.saleBookItems) {
                    subTotal += t.book.bookSpecification.price * t.quantity;
                }

                saleCart.appendChild(row);
                subTotalSpan.textContent = subTotal.toString() + " TL";
            }
        }
    }

    public cartToSale() {
        let saleCart: SaleCart = this.saleCart;
        let sale = new Sale();

        sale.saleBookItems = saleCart.saleBookItems;
        sale.customerId = saleCart.customerId;
        sale.operationNumber = this.generateSaleNumber(saleCart.customerId);
        sale.operationDateTime = new Date();
        sale.total = this.calculateTotal(sale);

        for (let q of sale.saleBookItems) {
            stockService.increaseStock(q.book.isbn, - q.quantity)
        }

        this.addSaleMock(sale);
        this.saleCart = new SaleCart(); // sepeti boşalt
        this.updateSaleCart();
    }

    async addSaleMock(s: Sale) {
        try {
            console.log(s.saleBookItems);

            const response = await fetch(this.saleApi, {
                method: 'POST',
                body: JSON.stringify({
                    bookAndQuantity: Array.from(s.saleBookItems),
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

            if (!response.ok) {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }

            const result = (await response.json());
            console.log(result);

            alert(result.message + " " + result.saleNumber);

        } catch (Exception) {
            console.log('Hata Oluştu.');
        }
    }



}

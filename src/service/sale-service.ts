import { stockService } from "..";
import { Book } from "../domain/book";
import { Sale } from "../domain/sale";
import { OrderBookItems } from "../domain/order-book-item";
import { SaleCart } from "../domain/sale-cart";

const SALE_API = 'http://localhost:3002/api/v1/sales';

export class SaleService {
    private _saleList: Array<Sale>;
    private _saleCart: SaleCart;

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

    public calculateTotal(items: Array<OrderBookItems>): number {
        let subTotal = 0.0;

        for (let entry of items) {
            subTotal += entry.book.bookPrice.price * entry.quantity;
        }

        return subTotal;
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
        let index = this.saleCart.orderBookItems.findIndex(x => x.book.isbn === book.isbn);

        if (index === -1) {
            this.saleCart.orderBookItems.push(orderBookItems);
        } else {
            this.saleCart.orderBookItems[index] = orderBookItems;
        }

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

    public async createSale(): Promise<Sale> {
        const response = await fetch(SALE_API, {
            method: 'POST',
            body: JSON.stringify({
                orderBookItems: Array.from(this.saleCart.orderBookItems),
                customerId: this.saleCart.customerId,
                total: this.calculateTotal(this.saleCart.orderBookItems)
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Kitap satış işleminde hata meydana geldi, hata kodu: ${response.status} `);
        }

        const result = <Sale>(await response.json());
        this.saleCart = new SaleCart(); // sepeti boşalt
        this.updateSaleCart();

        console.log("Rest apidan dönen cevap:\n");
        console.log(result);
        return result;

    }

    public async isExistSale(operationNumber: string): Promise<boolean> {
        const response = await fetch(SALE_API + "/" + operationNumber, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        console.log(response);

        if (!response.ok) {
            return false;
        }

        const result = (await response.json());
        console.log("Rest apidan dönen cevap:\n");
        console.log(result);
        return true;
    }

}

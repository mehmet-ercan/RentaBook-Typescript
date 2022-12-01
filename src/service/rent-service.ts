import { stockService } from "..";
import { Book } from "../domain/book";
import { Rent } from "../domain/rent";
import { RentCart } from "../domain/rent-cart";
import { OrderBookItems } from "../domain/order-book-item";
import { Stock } from "../domain/stock";

const REFUND_API = 'http://localhost:3002/api/v1/refunds/rents';
const RENT_API = 'http://localhost:3002/api/v1/rents';

export class RentService {
    private _rentList: Array<Rent>;

    private _rentCart: RentCart;

    refundPercent: number;

    constructor(rentList: Array<Rent>, rentCart: RentCart) {
        this._rentList = rentList;
        this.refundPercent = 0.75;
        this._rentCart = rentCart;
    }

    /**
     * Getter rentList
     * @return {Array<Rent>}
     */
    public get rentList(): Array<Rent> {
        return this._rentList;
    }

    /**
     * Setter rentList
     * @param {Array<Rent>} value
     */
    public set rentList(value: Array<Rent>) {
        this._rentList = value;
    }

    /**
     * Getter rentCart
     * @return {RentCart}
     */
    public get rentCart(): RentCart {
        return this._rentCart;
    }

    /**
     * Setter rentCart
     * @param {RentCart} value
     */
    public set rentCart(value: RentCart) {
        this._rentCart = value;
    }

    /**
     * Kitapların hepsi sepete eklendikten sonra toplma ücreti hesaplauan fonksiyon
     * @param rent Kitapların listesinin bulunduğu nesne
     * @returns Toplam ücret
     */
    public calculateTotal(rent: Rent): number {
        let subTotal: number = 0;

        //it can be => let entry of rent.bookAndQuantityMap.entries()
        for (let item of rent.orderBookItems) {
            subTotal += item.book.bookPrice.price * item.quantity
        }

        return subTotal;
    }

    public getRent(rentNumber: string): Rent {
        let rent = this.rentList.find(s => s.operationNumber === rentNumber);
        return rent!;
    }

    public addBookToCart(book: Book, quantity: number, customerId: number) {
        if (this.rentCart.orderBookItems.length === 0) {
            this.rentCart.customerId = customerId;
        } else if (this.rentCart.orderBookItems.length > 0) {
            if (this.rentCart.customerId !== customerId) {
                alert("Farklı müşteriye kitap kiralanmaya çalışılıyor. Lütfen tek müşteri için işlem yapınız");
                return false;
            }
        }

        let orderBookItems: OrderBookItems = new OrderBookItems(book, quantity);
        let index = this.rentCart.orderBookItems.findIndex(x => x.book.isbn === book.isbn);

        if (index === -1) {
            this.rentCart.orderBookItems.push(orderBookItems)
        } else {
            this.rentCart.orderBookItems[index] = orderBookItems;
        }
        this.updateRentCart();
    }

    public updateRentCart() {
        const rentCart = document.getElementById("rentCart");
        const subTotalSpan = document.getElementById("totalRentAmountTl");

        if (rentCart) {

            let row, column, subTotal: number = 0;

            while (rentCart.lastChild && rentCart.children.length > 1) {
                rentCart.removeChild(rentCart.lastChild);
            }
            subTotalSpan!.textContent = "";

            for (let index = 0; index < this.rentCart.orderBookItems.length; index++) {

                row = document.createElement("div");
                row.className = "rent-cart-row";

                for (let item of this.rentCart.orderBookItems) {

                    column = document.createElement("div");
                    column.className = "rent-cart-column";
                    column.textContent = this.rentCart.customerId.toString();
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "rent-cart-column";
                    column.textContent = item.book.name;
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "rent-cart-column";
                    column.textContent = item.quantity.toString();
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "rent-cart-column";
                    column.textContent = (item.book.bookPrice.price * item.quantity).toString();
                    row.appendChild(column);
                }
            }

            if (row && subTotalSpan) {

                for (let t of this.rentCart.orderBookItems) {
                    subTotal += t.book.bookPrice.price * t.quantity;
                }

                rentCart.appendChild(row);
                subTotalSpan.textContent = subTotal.toString() + " TL";
            }
        }
    }

    public async cartToRent() {
        let rentCart: RentCart = this.rentCart;
        let rent = new Rent();

        rent.orderBookItems = rentCart.orderBookItems;
        rent.customerId = rentCart.customerId;
        rent.total = this.calculateTotal(rent);

        this.rentCart = new RentCart; // sepeti boşalt
        this.updateRentCart();
        this.createRent(rent);
    }

    public async createRent(r: Rent) {
        try {
            const response = await fetch(RENT_API, {
                method: 'POST',
                body: JSON.stringify({
                    orderBookItems: Array.from(r.orderBookItems),
                    customerId: r.customerId,
                    total: r.total,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const result = <Rent>(await response.json());
                console.log("Rest apidan dönen cevap:\n");
                console.log(result);
                alert("Kitap kiralama işlemi başarıyla gerçekleşmiştir.");
                alert("Fişinizi kaybetneyiniz. Fiş numaranız: " + result.operationNumber);
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }
        } catch (Exception) {
            console.log('Hata Oluştu.');
            alert("Kitap kiralama işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.");
        }
    }

    public async refundRent(operationNumber: string): Promise<Rent> {
        //PATCH Belirli bir kaynaktaki verilerin bir kısmının değiştirilmesi için kullanılan metodtur.
        try {
            const response = await fetch(REFUND_API + "/" + operationNumber, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const result = <Rent>(await response.json());
                console.log(result);
                return result;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }
        } catch (Exception) {
            console.log('Hata Oluştu.');
            return null as any;
        }
    }

    public async isExistRent(operationNumber: string): Promise<boolean> {
        const response = await fetch(RENT_API + "/" + operationNumber, {
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
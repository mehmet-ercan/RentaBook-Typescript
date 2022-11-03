import { stockService } from "..";
import { DataBase } from "../db/database";
import { Book } from "../domain/book";
import { Rent } from "../domain/rent";
import { RentCart } from "../domain/rent-cart";
import { SaleCart } from "../domain/sale-cart";

export class RentService {
    private _rentList: Array<Rent>;

    private _rentCart: RentCart;
    public rentApi = 'http://localhost:3002/api/rents';
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



    public addRent(rent: Rent): void {
        this.rentList.push(rent);
    }

    public calculateTotal(rent: Rent): number {

        let map: Map<Book, number> = rent.bookAndQuantityMap;

        let subTotal: number = 0;

        //it can be => let entry of rent.bookAndQuantityMap.entries()
        for (let entry of rent.bookAndQuantityMap) {
            subTotal += entry[0].bookSpec.price * entry[1];
        }

        return subTotal;
    }

    // R051022145509 => domain.Rent 05.10.2022 14:55.09
    generateRentNumber(customerId: number): string {
        let today = new Date();
        let receiptNumber: string = "R" + today.getDay().toString + today.getMonth().toString + today.getFullYear().toString + today.getHours().toString + today.getMinutes().toString + today.getSeconds().toString + customerId.toString;

        return receiptNumber;
    }

    public calculateRefund(rent: Rent): void {
        rent.refund = rent.total * this.refundPercent;
    }

    public addBookToCart(book: Book, quantity: number, customerId: number) {
        if (this.rentCart.bookAndQuantityMap.size === 0) {
            this.rentCart.customerId = customerId;
        } else if (this.rentCart.bookAndQuantityMap.size > 0) {
            if (this.rentCart.customerId !== customerId) {
                alert("Farklı müşteriye kitap kiralanmaya çalışılıyor. Lütfen tek müşteri için işlem yapınız");
                return false;
            }
        }

        this.rentCart.bookAndQuantityMap.set(book, quantity);
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

            for (let index = 0; index < this.rentCart.bookAndQuantityMap.size; index++) {

                row = document.createElement("div");
                row.className = "rent-cart-row";

                for (let entry of this.rentCart.bookAndQuantityMap.entries()) {

                    column = document.createElement("div");
                    column.className = "rent-cart-column";
                    column.textContent = this.rentCart.customerId.toString();
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "rent-cart-column";
                    column.textContent = entry[0].name;
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "rent-cart-column";
                    column.textContent = entry[1].toString();
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "rent-cart-column";
                    column.textContent = (entry[0].bookSpec.price * entry[1]).toString();
                    row.appendChild(column);
                }
            }

            if (row && subTotalSpan) {

                for (let t of this.rentCart.bookAndQuantityMap) {
                    subTotal += t[0].bookSpec.price * t[1];
                }

                rentCart.appendChild(row);
                subTotalSpan.textContent = subTotal.toString() + " TL";
            }
        }



    }

    public cartToRent() {
        let rentCart: RentCart = this.rentCart;
        let rent = new Rent();

        rent.bookAndQuantityMap = rentCart.bookAndQuantityMap;
        rent.customerId = rentCart.customerId;
        rent.operationNumber = this.generateRentNumber(rentCart.customerId);
        rent.operationDateTime = new Date();
        rent.total = this.calculateTotal(rent);

        for (let q of rent.bookAndQuantityMap) {
            stockService.increaseStock(q[0].isbn, -q[1])
        }


        this.rentCart = new RentCart; // sepeti boşalt
        this.updateRentCart();

        let success = this.addRentMock(rent);
    }

    async addRentMock(r: Rent): Promise<Boolean | undefined> {
        try {
            console.log(r.bookAndQuantityMap);

            const response = await fetch(this.rentApi, {
                method: 'POST',
                body: JSON.stringify({
                    bookAndQuantity: r.bookAndQuantityMap,
                    customerId: r.customerId,
                    operationDateTime: r.operationDateTime,
                    operationNumber: r.operationNumber,
                    total: r.total
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const result = (await response.json());
                console.log(result);
                alert(result.message + " " + result.saleNumber);
                return true;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }



        } catch (Exception) {
            console.log('Hata Oluştu.');
        }
    }


}
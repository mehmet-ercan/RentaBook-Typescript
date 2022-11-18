import { stockService } from "..";
import { Book } from "../domain/book";
import { Rent } from "../domain/rent";
import { RentCart } from "../domain/rent-cart";
import { SaleBookItems } from "../domain/sale-book-item";

export class RentService {
    private _rentList: Array<Rent>;

    private _rentCart: RentCart;
    public rentApi = 'http://localhost:3002/api/v1/rents';
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

    /**
     * Kitapların hepsi sepete eklendikten sonra toplma ücreti hesaplauan fonksiyon
     * @param rent Kitapların listesinin bulunduğu nesne
     * @returns Toplam ücret
     */
    public calculateTotal(rent: Rent): number {
        let subTotal: number = 0;

        //it can be => let entry of rent.bookAndQuantityMap.entries()
        for (let item of rent.saleBookItems) {
            subTotal += item.book.bookSpecification.price * item.quantity
        }

        return subTotal;
    }

    // R051022145509 => domain.Rent 05.10.2022 14:55.09
    generateRentNumber(customerId: number): string {
        let today = new Date();
        let receiptNumber: string = "R" + today.getDay().toString() + 
        today.getMonth().toString() + today.getFullYear().toString() + 
        today.getHours().toString() + today.getMinutes().toString() + 
        today.getSeconds().toString() + customerId.toString();

        return receiptNumber;
    }

    /**
     * 
     * @param d1 Kitaplaın kiralık olarak alındığı tarih
     * @param d2 Kitapların geri getirildiği tarih
     * @returns İki tarih arasındaki fark (saat olarak)
     */
    public calculateDiffHours(d1: Date, d2: Date): number {

        let diffMilis: number = (d1.getTime() - d2.getTime());// mili seconds
        let diffHour = Math.floor(diffMilis / 1000 / 60 / 60); // /1000 > second / 60 > min / 60 > hour
        return diffHour;
    }

    /**
     * Kitap ilk kiralandığı anda, zamanında getirildiği gibi düşünülerek verilecek olan varsayılan geri ödeme miktarı
     * @param rent Hesaplanacak olan geri ödeme miktarının içinde bulunduğu nesne
     */
    public calculateRefund(rent: Rent): void {
        rent.refund = rent.total * this.refundPercent;
    }

    /**
     * Kitap kiralandı, okundu ve geri getirildiği zaman ne kadar geri ödeme verileceğini hesaplar
     * @param rent Hesaplanacak olan geri ödeme miktarının içinde bulunduğu nesne
     * @returns Geri ödeme miktarı
     */
    public calculateRefundAmount(rent: Rent): number {
        let diff = this.calculateDiffHours(rent.refundDate, rent.operationDateTime) / 24;
        let refund: number;

        if (diff <= 14) {
            refund = rent.total * 0.75;
        } else if (diff <= 24) {
            let fine = (0.75 - ((diff - 14) * 0.05));
            refund = rent.total * fine;
        }
        else {
            refund = rent.total * 0.25;
        }

        return refund;
    }

    public getRent(rentNumber: string): Rent {
        let rent = this.rentList.find(s => s.operationNumber === rentNumber);
        return rent!;
    }

    public addBookToCart(book: Book, quantity: number, customerId: number) {
        if (this.rentCart.saleBookItems.length === 0) {
            this.rentCart.customerId = customerId;
        } else if (this.rentCart.saleBookItems.length > 0) {
            if (this.rentCart.customerId !== customerId) {
                alert("Farklı müşteriye kitap kiralanmaya çalışılıyor. Lütfen tek müşteri için işlem yapınız");
                return false;
            }
        }

        this.rentCart.saleBookItems.push(new SaleBookItems(book, quantity))
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

            for (let index = 0; index < this.rentCart.saleBookItems.length; index++) {

                row = document.createElement("div");
                row.className = "rent-cart-row";

                for (let item of this.rentCart.saleBookItems) {

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
                    column.textContent = (item.book.bookSpecification.price * item.quantity).toString();
                    row.appendChild(column);
                }
            }

            if (row && subTotalSpan) {

                for (let t of this.rentCart.saleBookItems) {
                    subTotal += t.book.bookSpecification.price * t.quantity;
                }

                rentCart.appendChild(row);
                subTotalSpan.textContent = subTotal.toString() + " TL";
            }
        }



    }

    public cartToRent() {
        let rentCart: RentCart = this.rentCart;
        let rent = new Rent();

        rent.saleBookItems = rentCart.saleBookItems;
        rent.customerId = rentCart.customerId;
        rent.operationNumber = this.generateRentNumber(rentCart.customerId);
        rent.operationDateTime = new Date();
        rent.total = this.calculateTotal(rent);

        for (let i of rent.saleBookItems) {
            stockService.increaseStock(i.book.isbn, -i.quantity)
        }


        this.rentCart = new RentCart; // sepeti boşalt
        this.updateRentCart();

        let success = this.addRentMock(rent);
    }

    async addRentMock(r: Rent): Promise<Boolean | undefined> {
        try {
            const response = await fetch(this.rentApi, {
                method: 'POST',
                body: JSON.stringify({
                    saleBookItems: Array.from(r.saleBookItems),
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

    async refundRentMock(r: Rent) {

        //PATCH Belirli bir kaynaktaki verilerin bir kısmının değiştirilmesi için kullanılan metodtur.
        try {
            const response = await fetch(this.rentApi + "/" + r.operationNumber, {
                method: 'PATCH',
                body: JSON.stringify({
                    refundDate: r.refundDate,
                    refund: r.refund
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const result = (await response.json());
                console.log(result);
                return r.refund;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }
        } catch (Exception) {
            console.log('Hata Oluştu.');
        }
    }

}
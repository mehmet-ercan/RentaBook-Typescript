import { debug } from "webpack";
import { stockService } from "..";
import { DataBase } from "../db/database";
import { Book } from "../domain/book";
import { Customer } from "../domain/customer";
import { Sale } from "../domain/sale";
import { SaleCart } from "../domain/sale-cart";
import { StockService } from "../service/stock-service"

export class SaleService {
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

    public addSale(sale: Sale): void {
        this.dataBase.getSalesList.push(sale);
    }

    calculateTotal(sale: Sale): number {
        let subTotal = 0.0;

        for (let entry of sale.bookAndQuantityMap.entries()) {
            subTotal += entry[0].bookSpec.price * entry[1];
        }

        return subTotal;
    }

    generateSaleNumber(customerId: number): string {
        let today = new Date();
        let receiptNumber: string = "S" + today.getDay().toString() + today.getMonth().toString() + today.getFullYear().toString() + today.getHours().toString() + today.getMinutes().toString() + today.getSeconds().toString() + customerId.toString();

        return receiptNumber;
    }

    public getSale(saleNumber: string): Sale {

        let sale = this.dataBase.getSalesList.find(s => s.operationNumber === saleNumber);

        if (sale) {
            return sale;
        }


        throw new Error();
    }

    public removeSale(sale: Sale) {
        let index = this.dataBase.getSalesList.indexOf(sale);
        this.dataBase.getSalesList.splice(index, 1);
    }

    public addBookToCart(book: Book, quantity: number, customerId: number) {

        if (this.dataBase.getSaleCart.bookAndQuantityMap.size === 0) {
            this.dataBase.getSaleCart.customerId = customerId;
        } else if (this.dataBase.getSaleCart.bookAndQuantityMap.size > 0) {
            if (this.dataBase.getSaleCart.customerId !== customerId) {
                alert("Farklı müşteriye kitap satılmaya çalışılıyor. Lütfen tek müşteri için işlem yapınız");
                return false;
            }
        }

        this.dataBase.getSaleCart.bookAndQuantityMap.set(book, quantity);
        this.updateSaleCart();
    }

    public updateSaleCart() {
        const saleCart = document.getElementById("saleCart");
        const subTotalSpan = document.getElementById("totalAmountTl");

        if (saleCart) {

            let row, column, subTotal: number = 0;
            while (saleCart.lastChild && saleCart.children.length > 1) {
                saleCart.removeChild(saleCart.lastChild);
            }

            for (let index = 0; index < this.dataBase.getSaleCart.bookAndQuantityMap.size; index++) {

                row = document.createElement("div");
                row.className = "row";

                for (let entry of this.dataBase.getSaleCart.bookAndQuantityMap.entries()) {

                    column = document.createElement("div");
                    column.className = "column";
                    column.textContent = this.dataBase.getSaleCart.customerId.toString();
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "column";
                    column.textContent = entry[0].name;
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "column";
                    column.textContent = entry[1].toString();
                    row.appendChild(column);

                    column = document.createElement("div");
                    column.className = "column";
                    column.textContent = (entry[0].bookSpec.price * entry[1]).toString();
                    row.appendChild(column);
                }
            }

            if (row && subTotalSpan) {

                for (let t of this.dataBase.getSaleCart.bookAndQuantityMap) {
                    subTotal += t[0].bookSpec.price * t[1];
                }

                saleCart.appendChild(row);
                subTotalSpan.textContent = subTotal.toString() + " TL";
            }
        }



    }

    public cartToSale() {
        let saleCart: SaleCart = this.dataBase.getSaleCart;
        let sale = new Sale();
        sale.bookAndQuantityMap = saleCart.bookAndQuantityMap;
        sale.customerId = saleCart.customerId;
        sale.operationNumber = this.generateSaleNumber(saleCart.customerId);
        sale.operationDateTime = new Date();
        sale.total = this.calculateTotal(sale);

        for (let q of sale.bookAndQuantityMap) {
            stockService.increaseStock(q[0].isbn, -q[1])
        }

        this.addSale(sale);
        this.dataBase.setSaleCart = new SaleCart; // sepeti boşalt
        this.updateSaleCart();

        console.log(sale.operationNumber);
        alert("Satış gerçekleşmiştir. Fiş Numaranız: " + sale.operationNumber + "\nFişinizi kaybetmeyiniz. ");
    }

}
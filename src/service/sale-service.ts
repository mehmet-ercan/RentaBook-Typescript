import { DataBase } from "../db/database";
import { Book } from "../domain/book";
import { Sale } from "../domain/sale";

export class SaleService {
    db: DataBase;

    constructor(db: DataBase) {
        this.db = db;
    }

    calculateTotal(sale: Sale): number {
        let subtotal = 0.0;

        for (let entry of sale.bookAndQuantityMap.entries()) {
            subtotal += entry[0].bookSpec.price * entry[1];
        }

        return subtotal;
    }

    generateSaleNumber(customerId: number): string {
        let today = new Date();
        let receiptNumber: string = today.getDay() + today.getMonth() + today.getFullYear() + today.getHours() + today.getMinutes() + today.getSeconds() + customerId.toString();

        return receiptNumber;
    }

}
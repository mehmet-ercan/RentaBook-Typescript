import { DataBase } from "../db/database";
import { Book } from "../domain/book";
import { Sale } from "../domain/sale";

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
        let receiptNumber: string = "S" + today.getDay().toString + today.getMonth().toString + today.getFullYear().toString + today.getHours().toString + today.getMinutes().toString + today.getSeconds().toString + customerId.toString;

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
        this.dataBase.getSalesList.pop(sale);
    }

}
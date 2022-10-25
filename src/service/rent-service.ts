import { DataBase } from "../db/database";
import { Book } from "../domain/book";
import { Rent } from "../domain/rent";

export class RentService {
    private _dataBase: DataBase;
    refundPercent: number;

    constructor(dataBase: DataBase) {
        this._dataBase = dataBase;
        this.refundPercent = 0.75;
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

    public addRent(rent: Rent): void {
        this.dataBase.getRents.push(rent);
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


}
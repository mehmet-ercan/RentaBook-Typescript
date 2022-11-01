import { DataBase } from "../db/database";
import { Book } from "../domain/book";
import { Rent } from "../domain/rent";

export class RentService {
    private _rentList: Array<Rent>;
    refundPercent: number;


    constructor(rentList: Array<Rent>) {
        this._rentList = rentList;
        this.refundPercent = 0.75;
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


}
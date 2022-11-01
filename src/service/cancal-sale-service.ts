import { DataBase } from "../db/database";
import { CancelSale } from "../domain/cancal-sale";

export class CancelSaleService {
    private _cancelledSalesList: Array<CancelSale>;


	constructor(cancelledSalesList: Array<CancelSale>) {
		this._cancelledSalesList = cancelledSalesList;
	}
    

    /**
     * Getter cancelledSalesList
     * @return {Array<CancelSale>}
     */
	public get cancelledSalesList(): Array<CancelSale> {
		return this._cancelledSalesList;
	}

    /**
     * Setter cancelledSalesList
     * @param {Array<CancelSale>} value
     */
	public set cancelledSalesList(value: Array<CancelSale>) {
		this._cancelledSalesList = value;
	}



    public cancelSale(cancelSale: CancelSale): void {
        this.cancelledSalesList.push(cancelSale);
        let refund: number = this.calculateRefund(cancelSale);
        cancelSale.refund = refund;
    }

    public calculateRefund(cancelSale: CancelSale): number {


        let diff = this.calculateDiffHours(cancelSale.canceledDateTime, cancelSale.sale.operationDateTime)
        let refund: number;

        if (diff > 24) {
            refund = cancelSale.sale.total * 0.75;
        } else {
            refund = cancelSale.sale.total;
        }
        return refund;
    }

    public calculateDiffHours(d1: Date, d2: Date): number {

        let diffMilis: number = (d1.getTime() - d2.getTime());// mili seconds
        let diffHour = Math.floor(diffMilis / 1000 / 60 / 60 ); // /1000 > second / 60 > min / 60 > hour
        return diffHour;
    }

}
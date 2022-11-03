import { CancelSale } from "../domain/cancal-sale";

export class CancelSaleService {
    private _cancelledSalesList: Array<CancelSale>;
    cancelSaleApi: string = 'http://localhost:3002/api/cancelSale';

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
        let refund: number = this.calculateRefund(cancelSale);
        cancelSale.refund = refund;
        this.cancelledSalesList.push(cancelSale);
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
        let diffHour = Math.floor(diffMilis / 1000 / 60 / 60); // /1000 > second / 60 > min / 60 > hour
        return diffHour;
    }

    async cancelSaleMock(cancelSale: CancelSale): Promise<Boolean | undefined> {
        let refund: number = this.calculateRefund(cancelSale);

        cancelSale.refund = refund;

        try {
            const response = await fetch(this.cancelSaleApi, {
                method: 'POST',
                body: JSON.stringify({
                    sale: cancelSale.sale,
                    refund: cancelSale.refund,
                    canceledDateTime: cancelSale.canceledDateTime
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            //Todo sale mock servisine delete isteği atıp o sale nesnesini silecek

            if (response.ok) {
                const result = (await response.json());
                console.log(result);
                return true;
            }else{
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }

           

        } catch (Exception) {
            console.log('Hata Oluştu.');
        }


    }


}
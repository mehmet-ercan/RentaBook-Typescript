import { Cancel } from "../domain/cancel";

export class CancelService {
    private _cancelledList: Array<Cancel>;
    cancelSaleApi: string = 'http://localhost:3002/api/v1/sales';
    cancelRentApi: string = 'http://localhost:3002/api/v1/rents';

    constructor(cancelledList: Array<Cancel>) {
        this._cancelledList = cancelledList;
    }

    /**
     * Getter cancelledSalesList
     * @return {Array<CancelSale>}
     */
    public get cancelledList(): Array<Cancel> {
        return this._cancelledList;
    }

    /**
     * Setter cancelledSalesList
     * @param {Array<CancelSale>} value
     */
    public set cancelledList(value: Array<Cancel>) {
        this._cancelledList = value;
    }

    public calculateDiffHours(d1: Date, d2: Date): number {

        let diffMilis: number = (d1.getTime() - d2.getTime());// mili seconds
        let diffHour = Math.floor(diffMilis / 1000 / 60 / 60); // /1000 > second / 60 > min / 60 > hour
        return diffHour;
    }

    public cancelSale(cancel: Cancel): void {
        let refund: number = this.calculateCancelSaleRefund(cancel);
        cancel.refund = refund;
        this.cancelledList.push(cancel);
    }

    public calculateCancelSaleRefund(cancelSale: Cancel): number {
        let diff = this.calculateDiffHours(cancelSale.canceledDateTime, cancelSale.cancelType.operationDateTime)
        let refund: number;

        if (diff > 24) {
            refund = cancelSale.cancelType.total * 0.75;
        } else {
            refund = cancelSale.cancelType.total;
        }
        return refund;
    }

    async cancelSaleMock(operationNumber: string) {
        try {
            const response = await fetch(this.cancelSaleApi + "/" + operationNumber, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            //Todo sale mock servisine delete isteği atıp o sale nesnesini silecek

            if (response.ok) {
                // Delete işlemnde .json şeklşnde serilize yapılamaz, hata verir
                // const result = (await response.json());
                console.log(response);
                return true;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }
        } catch (Exception) {
            console.log('Hata Oluştu.');
        }


    }

    public cancelRent(cancel: Cancel) {
        let refund: number = this.calculateCancelRentRefund(cancel);
        cancel.refund = refund;
        this.cancelledList.push(cancel);
    }

    public calculateCancelRentRefund(cancelRent: Cancel): number {
        let diff = this.calculateDiffHours(cancelRent.canceledDateTime, cancelRent.cancelType.operationDateTime)
        let refund: number;

        if (diff > 24) {
            refund = cancelRent.cancelType.total * 0.75;
        } else {
            refund = cancelRent.cancelType.total;
        }
        return refund;
    }

    async cancelRentMock(operationNumber: string): Promise<boolean> {

        const response = await fetch(this.cancelRentApi + "/" + operationNumber, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (response.ok) {
            console.log(response);
            return true;
        } else {
            return false;
        }
    }

}
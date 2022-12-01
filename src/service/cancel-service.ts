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

    public async cancelRentMock(operationNumber: string): Promise<boolean> {

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

    public async cancelSaleMock(operationNumber: string) {
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

}
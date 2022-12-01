import { Cancel } from "../domain/cancel";
const CANCEL_SALE_API: string = 'http://localhost:3002/api/v1/sales';
const CANCEL_RENT_API: string = 'http://localhost:3002/api/v1/rents';

export class CancelService {
    private _cancelledList: Array<Cancel>;

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

    public async cancelRent(operationNumber: string): Promise<boolean> {

        const response = await fetch(CANCEL_SALE_API+ "/" + operationNumber, {
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

    public async cancelSale(operationNumber: string) {
        try {
            const response = await fetch(CANCEL_SALE_API+ "/" + operationNumber, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

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
import { Customer } from "../domain/customer";

export class CustomerService {
    private _customerList: Array<Customer>;
    private customerApi: string = "http://localhost:3002/api/v1/customers";

    constructor(customerList: Array<Customer>) {
        this._customerList = customerList;
    }

    /**
     * Getter customerList
     * @return {Array<Customer>}
     */
    public get customerList(): Array<Customer> {
        return this._customerList;
    }

    /**
     * Setter customerList
     * @param {Array<Customer>} value
     */
    public set customerList(value: Array<Customer>) {
        this._customerList = value;
    }

    async getAllCustomersData(): Promise<Array<Customer>> {
        const response = await fetch(this.customerApi, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
        }
        const result = (await response.json());
        const getResult = <Array<Customer>>result;
        return getResult;
    }

    async createCustomer(newCustomer: Customer) {
        try {
            const response = await fetch(this.customerApi, {
                method: 'POST',
                body: JSON.stringify({
                    name: newCustomer.name,
                    surName: newCustomer.surName,
                    phoneNumber: newCustomer.phoneNumber
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const result = (await response.json());
                console.log("Rest servisinden dönen cevap =>");
                console.log(result);
                return true;
            } else {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }
        } catch (Exception) {
            console.log('Hata Oluştu.');
        }
    }

    async getCustomer(customerId: number): Promise<Customer> {
        try {
            const response = await fetch(this.customerApi + "/" + customerId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                }
            });

            if (!response.ok) {
                alert(`Error! status: ${response.body}`);
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = (await response.json());
            const getResult = <Customer>result;
            return getResult;

        } catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
            } else {
                console.log('unexpected error: ', error);
            }
            return null as any;
        }
    }
}
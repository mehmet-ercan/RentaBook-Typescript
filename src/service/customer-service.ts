import { DataBase } from "../db/database";
import { Customer } from "../domain/customer";

export class CustomerService {
    private _customerList: Array<Customer>;
    private customerApi: string = "http://localhost:3002/api/customers/";

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


    public addCustomer(newCustomer: Customer) {
        this.customerList.push(newCustomer);
    }

    public getNewCustomerId(): number {
        let lastCustomerId: number = 0;

        if (this.customerList.length > 0) {

            lastCustomerId = this.customerList.at(this.customerList.length - 1)!.id;
        }

        lastCustomerId = lastCustomerId + 1;

        return lastCustomerId;
    }

    public getCustomerInfo(id: number): Customer | undefined {

        let customer = this.customerList.find(customer => customer.id === id);

        if (customer) {
            return customer;
        } else {
            return undefined;
        }
    }

    public isValidCustomer(customerId: number): boolean {

        let isValid = this.customerList.some(customer => customer.id === customerId);

        if (isValid) {
            return true;
        } else {
            return false;
        }
    }

    async addCustomerMock(newCustomer: Customer) {
        try {
            const response = await fetch(this.customerApi, {
                method: 'POST',
                body: JSON.stringify({
                    id: newCustomer.id,
                    name: newCustomer.name,
                    surName: newCustomer.surName,
                    phoneNumber: newCustomer.phoneNumber
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Hata oluştu, hata kodu: ${response.status} `);
            }

            const result = (await response.json());
            console.log(result);

        } catch (Exception) {
            console.log('Hata Oluştu.');
        }
    }
}
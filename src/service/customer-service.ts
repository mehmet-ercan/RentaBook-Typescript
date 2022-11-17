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

    public addCustomer(newCustomer: Customer) {
        this.customerList.push(newCustomer);
    }

    /*
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
    */

    async addCustomerMock(newCustomer: Customer) {
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
}
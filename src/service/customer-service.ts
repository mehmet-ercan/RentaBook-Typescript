import { DataBase } from "../db/database";
import { Customer } from "../domain/customer";

export class CustomerService {
    private _dataBase: DataBase;

    constructor(dataBase: DataBase) {
        this._dataBase = dataBase;
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

    public addCustomer(newCustomer: Customer): boolean {
        this.dataBase.getCustomersList.push(newCustomer);
        return true;
    }

    public getNewCustomerId(): number {
        let lastCustomerId: number = 0;

        if (this.dataBase.getCustomersList.length > 0) {

            lastCustomerId = this.dataBase.getCustomersList.at(this.dataBase.getCustomersList.length - 1)!.id;
        }

        lastCustomerId = lastCustomerId + 1;

        return lastCustomerId;
    }

    public getCustomerInfo(id: number): Customer {
        return this.dataBase.getCustomersList.find(customer => customer.id === id)!;
    }

    public isValidCustomer(customerId: number): boolean {
        //return dataBase.getCustomersList().stream().anyMatch(c -> c.getId() == customerId);
        let isvalid = this.dataBase.getCustomersList.find(customer => customer.id === customerId);
        if (isvalid) {
            return true;
        } else {
            return false;
        }
    }
}
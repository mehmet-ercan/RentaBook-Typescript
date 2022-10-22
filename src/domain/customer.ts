export class Customer {
  id: number;
  name: string;
  surName: string;
  phoneNumber: string;

  constructor(id: number, name: string, surName: string, phoneNumber: string) {
    this.id = id;
    this.name = name;
    this.surName = surName;
    this.phoneNumber = phoneNumber;
  }
}

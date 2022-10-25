export class Customer {
  private _id: number;
  private _name: string;
  private _surName: string;
  private _phoneNumber: string;

  constructor(id: number, name: string, surName: string, phoneNumber: string) {
    this._id = id;
    this._name = name;
    this._surName = surName;
    this._phoneNumber = phoneNumber;
  }


    /**
     * Getter id
     * @return {number}
     */
	public get id(): number {
		return this._id;
	}

    /**
     * Getter name
     * @return {string}
     */
	public get name(): string {
		return this._name;
	}

    /**
     * Getter surName
     * @return {string}
     */
	public get surName(): string {
		return this._surName;
	}

    /**
     * Getter phoneNumber
     * @return {string}
     */
	public get phoneNumber(): string {
		return this._phoneNumber;
	}

    /**
     * Setter id
     * @param {number} value
     */
	public set id(value: number) {
		this._id = value;
	}

    /**
     * Setter name
     * @param {string} value
     */
	public set name(value: string) {
		this._name = value;
	}

    /**
     * Setter surName
     * @param {string} value
     */
	public set surName(value: string) {
		this._surName = value;
	}

    /**
     * Setter phoneNumber
     * @param {string} value
     */
	public set phoneNumber(value: string) {
		this._phoneNumber = value;
	}


}

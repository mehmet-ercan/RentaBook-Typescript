export class Customer {
  private _name: string;
  private _surName: string;
  private _phoneNumber: string;

  constructor(name: string, surName: string, phoneNumber: string) {
    this._name = name;
    this._surName = surName;
    this._phoneNumber = phoneNumber;
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

export class User {
  constructor(
    public username: string,
    public fullName: string,
    public credit: string,
    public perms: {
      pathDrinkAll: boolean,
      modSupplier: boolean,
      modDrink: boolean,
      modUser: boolean,
      setOwnPass: boolean
    }
  ) { }
}

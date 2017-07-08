export class User {
  constructor(
    public username: string,
    public firstName: string,
    public lastName: string,
    public credit: number,
    public perms: {
      pathDrinkAll: boolean,
      modSupplier: boolean,
      modDrink: boolean,
      modUser: boolean,
      setOwnPass: boolean
    }
  ) { }
}

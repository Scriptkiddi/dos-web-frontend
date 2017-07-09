export class User {
  constructor(
    public uid: string,
    public givenName: string,
    public surname: string,
    public credit: number,
    public permissions: {
      Type: string,
      PatchDrinkEveryone: boolean,
      ModSuppliers: boolean,
      ModDrink: boolean,
      ModUser: boolean,
      SetOwnPassword: boolean
    }
  ) { }
}

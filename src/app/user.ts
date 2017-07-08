export class User {
  constructor(
    public Username: string,
    public FirstName: string,
    public LastName: string,
    public Credit: number,
    public Permissions: {
      Type: string,
      PatchDrinkEveryone: boolean,
      ModSuppliers: boolean,
      ModDrink: boolean,
      ModUser: boolean,
      SetOwnPassword: boolean
    }
  ) { }
}

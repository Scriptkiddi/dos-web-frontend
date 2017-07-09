export class Drink {
  constructor(
    public ean: string,
    public name: string,
    public priceOrder: number,
    public priceResell: number,
    public amount: number,
    public supplier: {
      id: string,
      name: string,
      address: string,
      deliveryTime: number
    },
    public redeliverAmount: number,
    public imageUrl: string
  ) { }
}

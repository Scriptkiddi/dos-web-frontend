export class Drink {
  constructor(
    public EAN: string,
    public Name: string,
    public PriceOrder: number,
    public PriceResell: number,
    public Amount: number,
    public Supplier: any,
    public RedeliverAmount: number,
    public ImgUrl: string
  ) { }
}

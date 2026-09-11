export class Address {
  constructor(
    public id: number = 0,
    public zipCode: string = '',
    public street: string = '',
    public number: string = '',
    public complement: string = '',
    public neighborhood: string = '',
    public city: string = '',
    public state: string = '',
  ) {

  }
}
export class Quote {
  constructor(
    public id: number = 0,
    public requestId: number = 0,
    public employeeId: number = 0,
    public price: number = 0,
    public description: string = '',
    public quoteDateTime: string = ''
  ) {}
}

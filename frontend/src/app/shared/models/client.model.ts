import { Address } from './address.model';

export class Client {
  constructor(
    public id: number = 0,
    public cpf: string = '',
    public name: string = '',
    public email: string = '',
    public phone: string = '',
    public password: string = '',
    public address: Address = new Address()
  ) {}
}

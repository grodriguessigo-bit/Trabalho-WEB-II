import { Address } from './address.model';
import { Person } from './person.model';

export class Client extends Person {
  constructor(
    id: number = 0,
    name: string = '',
    email: string = '',
    password: string = '',
    active: boolean = true,
    public cpf: string = '',
    public phone: string = '',
    public address: Address = new Address(),
  ) {
    super(id, name, email, password, active);
  }
}
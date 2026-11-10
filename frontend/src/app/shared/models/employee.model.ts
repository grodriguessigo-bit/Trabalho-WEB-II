import { Person } from "./person";

export class Employee extends Person {

  constructor(
    id: number = 0,
    name: string = '',
    email: string = '',
    password: string = '',
    active: boolean = true,
    public birthDate: string = ''
  ) {
    super(id, name, email, password, active);
  }

}
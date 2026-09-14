import { Injectable } from '@angular/core';
import { Employee } from '../shared/models/employee.model';

const LS_KEY = "employees";

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  listAll(): Employee[] {
    const employees = localStorage[LS_KEY];

    if (employees) {
      return JSON.parse(employees);
    }

    return [
      new Employee(
        1,
        "Maria",
        "maria@empresa.com",
        "1990-05-10",
        "1234"
      )
    ];
  }

  insert(employee: Employee): void {
    const employees = this.listAll();

    employee.id = new Date().getTime();

    employees.push(employee);

    localStorage[LS_KEY] = JSON.stringify(employees);
  }

  findById(id: number): Employee | undefined {
    const employees = this.listAll();

    return employees.find(employee => employee.id === id);
  }

  findByEmail(email: string): Employee | undefined {
    const employees = this.listAll();

    return employees.find(employee => employee.email === email);
  }

}
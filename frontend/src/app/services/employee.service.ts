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
        "2002-04-18",
        "1234",
        true
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

  update(employee: Employee): void {
    const employees = this.listAll();

    const index = employees.findIndex(
      item => item.id === employee.id
    );

    if (index !== -1) {
      employees[index] = employee;

      localStorage[LS_KEY] = JSON.stringify(employees);
    }
  }

  remove(id: number): void {
    const employee = this.findById(id);

    if (employee) {
      employee.active = false;

      this.update(employee);
    }
  }

}
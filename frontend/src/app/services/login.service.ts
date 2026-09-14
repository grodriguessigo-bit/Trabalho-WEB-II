import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { EmployeeService } from './employee.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(
    private clientService: ClientService,
    private employeeService: EmployeeService
  ) {}

  login(email: string, password: string): string {

    const employee = this.employeeService.findByEmail(email);

    if (employee && employee.password === password) {
      localStorage["loggedUserId"] = employee.id.toString();
      localStorage["loggedUserType"] = "EMPLOYEE";

      return "EMPLOYEE";
    }

    const client = this.clientService.findByEmail(email);

    if (client && client.password === password) {
      localStorage["loggedUserId"] = client.id.toString();
      localStorage["loggedUserType"] = "CLIENT";

      return "CLIENT";
    }

    return "";
  }

  getLoggedUserId(): number {
    return Number(localStorage["loggedUserId"]);
  }

  getLoggedUserType(): string {
    return localStorage["loggedUserType"];
  }

  logout(): void {
    localStorage.removeItem("loggedUserId");
    localStorage.removeItem("loggedUserType");
  }

}
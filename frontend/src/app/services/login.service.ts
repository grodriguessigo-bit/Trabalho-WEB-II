import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ClientService } from './client.service';
import { EmployeeService } from './employee.service';
import { Login } from '../shared/models/login.model';
import { LoggedUser } from '../shared/models/logged-user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(
    private clientService: ClientService,
    private employeeService: EmployeeService
  ) {}

  login(login: Login): Observable<LoggedUser | null> {

    const employee =
      this.employeeService.findByEmail(login.email);

    if (
      employee &&
      employee.active &&
      employee.password === login.password
    ) {

      return of(employee).pipe(
        map(user =>
          new LoggedUser(
            user.id,
            'EMPLOYEE'
          )
        )
      );
    }

    const client =
      this.clientService.findByEmail(login.email);

    if (
      client &&
      client.password === login.password
    ) {

      return of(client).pipe(
        map(user =>
          new LoggedUser(
            user.id,
            'CLIENT'
          )
        )
      );
    }

    return of(null);
  }

  setLoggedUser(user: LoggedUser): void {

    localStorage["loggedUserId"] =
      user.id.toString();

    localStorage["loggedUserType"] =
      user.type;
  }

  getLoggedUserId(): number {

    return Number(
      localStorage["loggedUserId"]
    );
  }

  getLoggedUserType(): string {

    return localStorage["loggedUserType"];
  }

  logout(): void {

    localStorage.removeItem(
      "loggedUserId"
    );

    localStorage.removeItem(
      "loggedUserType"
    );
  }

}
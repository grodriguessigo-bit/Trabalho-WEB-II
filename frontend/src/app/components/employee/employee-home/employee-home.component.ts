import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';
import { ClientService } from '../../../services/client.service';

import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';


@Component({
  selector: 'app-employee-home',
  imports: [RouterModule],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css',
})
export class EmployeeHomeComponent {
  employee: Employee | undefined;
  clientRequests: MaintenanceRequest[] = [];

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private clientService: ClientService
  )
  {
    this.clientRequests = this.maintenanceRequestService.findOpenRequest();

    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.loginService.getLoggedUserId();

    this.employee = this.employeeService.findById(id);

    this.clientRequests = this.maintenanceRequestService.findOpenRequest();
  }


  getClientName(clientId: number): string {

    const client =
      this.clientService.findById(clientId);

    if (client) {
      return client.name;
    }

    return '';
  }

  logout(): void {
    this.loginService.logout();

    this.router.navigate(['/login']);
  }

}

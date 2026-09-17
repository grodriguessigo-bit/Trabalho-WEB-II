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
  filterType: 'TODAS' | 'HOJE' | 'PERIODO' = 'TODAS';
  startDate = '';
  endDate = '';

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private clientService: ClientService
  )
  {
    this.loadClientRequests();

    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.loginService.getLoggedUserId();

    this.employee = this.employeeService.findById(id);

    this.loadClientRequests();
  }

  loadClientRequests(): void {
    const requests = this.maintenanceRequestService.findOpenRequest()
      .sort((a, b) => new Date(a.requestDateTime).getTime() - new Date(b.requestDateTime).getTime());

    switch (this.filterType) {
      case 'HOJE':
        this.clientRequests = requests.filter((request) => this.isSameDay(new Date(request.requestDateTime), new Date()));
        break;
      case 'PERIODO':
        this.clientRequests = requests.filter((request) => this.isInPeriod(new Date(request.requestDateTime)));
        break;
      default:
        this.clientRequests = requests;
        break;
    }
  }

  private isSameDay(dateA: Date, dateB: Date): boolean {
    return dateA.getFullYear() === dateB.getFullYear()
      && dateA.getMonth() === dateB.getMonth()
      && dateA.getDate() === dateB.getDate();
  }

  private isInPeriod(requestDate: Date): boolean {
    if (this.startDate) {
      const start = new Date(`${this.startDate}T00:00:00`);
      if (requestDate < start) {
        return false;
      }
    }

    if (this.endDate) {
      const end = new Date(`${this.endDate}T23:59:59`);
      if (requestDate > end) {
        return false;
      }
    }

    return true;
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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Employee } from '../../../shared/models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';
import { ClientService } from '../../../services/client.service';

import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';

@Component({
  selector: 'app-employee-home',
  imports: [RouterModule, CommonModule],
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
    private clientService: ClientService,
  ) {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.loginService.getLoggedUserId();
    this.employee = this.employeeService.findById(id);

    this.loadClientRequests();
  }

  loadClientRequests(): void {
    const requests = this.maintenanceRequestService.listAll()
      .sort((a, b) => new Date(a.requestDateTime).getTime() - new Date(b.requestDateTime).getTime());

    if (this.filterType === 'HOJE') {
      this.clientRequests = requests.filter((request) => this.isSameDay(new Date(request.requestDateTime), new Date()));
      return;
    }

    if (this.filterType === 'PERIODO') {
      this.clientRequests = requests.filter((request) => this.isInPeriod(new Date(request.requestDateTime)));
      return;
    }

    this.clientRequests = requests;
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
    const client = this.clientService.findById(clientId);
    return client ? client.name : 'Cliente não encontrado';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case RequestStatus.OPEN:
        return 'ABERTA';
      case RequestStatus.QUOTED:
        return 'ORÇADA';
      case RequestStatus.APPROVED:
        return 'APROVADA';
      case RequestStatus.REJECTED:
        return 'REJEITADA';
      case RequestStatus.REDIRECTED:
        return 'REDIRECIONADA';
      case RequestStatus.FIXED:
        return 'ARRUMADA';
      case RequestStatus.PAID:
        return 'PAGA';
      case RequestStatus.FINALIZED:
        return 'FINALIZADA';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case RequestStatus.OPEN:
        return 'bg-warning text-dark';
      case RequestStatus.APPROVED:
      case RequestStatus.REDIRECTED:
        return 'bg-primary';
      case RequestStatus.PAID:
        return 'bg-success';
      case RequestStatus.QUOTED:
      case RequestStatus.FIXED:
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  }

  getActionText(request: MaintenanceRequest): string {
    switch (request.status) {
      case RequestStatus.OPEN:
        return 'Efetuar Orçamento';
      case RequestStatus.APPROVED:
      case RequestStatus.REDIRECTED:
        return 'Efetuar Manutenção';
      case RequestStatus.PAID:
        return 'Finalizar Solicitação';
      default:
        return 'Visualizar';
    }
  }

  getActionRoute(request: MaintenanceRequest): any[] | null {
    switch (request.status) {
      case RequestStatus.OPEN:
        return ['/employee/quote-form', request.id];
      case RequestStatus.APPROVED:
      case RequestStatus.REDIRECTED:
      case RequestStatus.PAID:
        return ['/employee/home'];
      default:
        return null;
    }
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}


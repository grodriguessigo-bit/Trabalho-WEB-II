import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { EmployeeDTO, EmployeeService } from '../../../services/employee.service';
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
  employee: EmployeeDTO | undefined;
  clientRequests: MaintenanceRequest[] = [];
  filterType: 'ABERTAS' | 'TODAS' | 'HOJE' | 'PERIODO' = 'ABERTAS';
  startDate = '';
  endDate = '';

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
  ) {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.loginService.getLoggedUserId();
    this.employeeService.findById(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.cdr.markForCheck();
      },
      error: () => {
        this.employee = undefined;
        this.cdr.markForCheck();
      }
    });
    this.loadClientRequests();
  }

  loadClientRequests(): void {
    const requests = this.maintenanceRequestService.listAll()
      .sort((a, b) => new Date(a.requestDateTime).getTime() - new Date(b.requestDateTime).getTime());
    
    if (this.filterType === 'ABERTAS') {
      this.clientRequests = requests.filter(
        request => request.status === RequestStatus.OPEN
      );
      return;
    }

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
        return 'status-open';

      case RequestStatus.QUOTED:
        return 'status-quoted';

      case RequestStatus.REJECTED:
        return 'status-rejected';

      case RequestStatus.APPROVED:
        return 'status-approved';

      case RequestStatus.REDIRECTED:
        return 'status-redirected';

      case RequestStatus.FIXED:
        return 'status-fixed';

      case RequestStatus.PAID:
        return 'status-paid';

      case RequestStatus.FINALIZED:
        return 'status-finalized';

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
        return 'Sem ação disponível';
    }
  }

  getActionRoute(request: MaintenanceRequest): any[] | null {
    switch (request.status) {
      case RequestStatus.OPEN:
        return ['/employee/quote-form', request.id];

      case RequestStatus.APPROVED:
      case RequestStatus.REDIRECTED:
        return ['/employee/request/maintenance', request.id];

      case RequestStatus.PAID:
        return ['/employee/finalize-request', request.id];

      default:
        return null;
    }
  }

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        this.loginService.clearLoggedUser();
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Não foi possível sair. Tente novamente.');
      }
    });
  }
}


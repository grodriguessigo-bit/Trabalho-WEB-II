import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { EmployeeDTO, EmployeeService } from '../../../services/employee.service';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';

import { RequestStatus } from '../../../shared/enum/request-status.enum';
import {
  EmployeeRequestSummaryDTO,
  RequestFilter,
  STATUS_LABELS
} from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-employee-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css',
})
export class EmployeeHomeComponent implements OnInit {

  employee = signal<EmployeeDTO | null>(null);

  clientRequests =
    signal<EmployeeRequestSummaryDTO[]>([]);

  message = signal('');

  filterType: RequestFilter = 'ABERTAS';

  startDate = '';
  endDate = '';

  constructor(
    private employeeService: EmployeeService,
    private loginService: LoginService,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService
  ) {}

  ngOnInit(): void {

    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const id =
      this.loginService.getLoggedUserId();

    this.employeeService
      .findById(id)
      .subscribe({
        next: employee => {
          this.employee.set(employee);
        },

        error: () => {
          this.employee.set(null);
        }
      });

    this.loadClientRequests();
  }

  loadClientRequests(): void {

    this.message.set('');

    if (
      this.filterType === 'PERIODO' &&
      (!this.startDate || !this.endDate)
    ) {
      this.clientRequests.set([]);
      return;
    }

    this.maintenanceRequestService
      .listEmployeeRequests(
        this.filterType,
        this.startDate,
        this.endDate
      )
      .subscribe({
        next: response => {
          this.clientRequests.set(response.data);
        },

        error: error => {
          this.clientRequests.set([]);

          this.message.set(
            error.error?.message ??
            'Não foi possível consultar as solicitações.'
          );
        }
      });
  }

  getStatusLabel(status: RequestStatus): string {
    return STATUS_LABELS[status];
  }

  getStatusClass(status: RequestStatus): string {

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

  getActionText(
    request: EmployeeRequestSummaryDTO
  ): string {

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

  getActionRoute(
    request: EmployeeRequestSummaryDTO
  ): any[] | null {

    switch (request.status) {

      case RequestStatus.OPEN:
        return [
          '/employee/quote-form',
          request.maintenanceRequestId
        ];

      case RequestStatus.APPROVED:
      case RequestStatus.REDIRECTED:
        return [
          '/employee/request/maintenance',
          request.maintenanceRequestId
        ];

      case RequestStatus.PAID:
        return [
          '/employee/finalize-request',
          request.maintenanceRequestId
        ];

      default:
        return null;
    }
  }

  logout(): void {

    this.loginService
      .logout()
      .subscribe({
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
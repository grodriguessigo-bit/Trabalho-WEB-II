import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClientRequestSummaryDTO } from '../../../shared/models/request-api.model';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { LoginService } from '../../../services/login.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';

@Component({
  selector: 'app-client-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css',
})
export class ClientHomeComponent implements OnInit {
  requests = signal<ClientRequestSummaryDTO[]>([]);
  message = signal('');
  saving = signal(false);

  constructor(
    private maintenanceRequestService: MaintenanceRequestService,
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.message.set('');

    this.maintenanceRequestService.listClientRequests().subscribe({
      next: response => {
        if (response.success) {
          this.requests.set(response.data);
        } else {
          this.message.set(response.message);
        }
      },
      error: error => {
        this.message.set(
          error.error?.message ??
          'Não foi possível carregar as solicitações.'
        );
      }
    });
  }

  rescueRequest(requestId: number): void {
    if (this.saving()) {
      return;
    }

    this.message.set('');
    this.saving.set(true);

    this.maintenanceRequestService.rescueRequest(requestId).subscribe({
      next: response => {
        this.saving.set(false);

        if (response.success) {
          this.loadRequests();
        } else {
          this.message.set(response.message);
        }
      },
      error: error => {
        this.saving.set(false);

        this.message.set(
          error.error?.message ??
          'Não foi possível resgatar a solicitação.'
        );
      }
    });
  }

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        this.loginService.clearLoggedUser();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.message.set('Não foi possível sair. Tente novamente.');
      }
    });
  }

  getStatusLabel(status: RequestStatus): string {
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
}
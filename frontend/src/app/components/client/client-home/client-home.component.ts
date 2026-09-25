import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../shared/models/client.model';
import { ClientService } from '../../../services/client.service';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';
import { CommonModule } from '@angular/common';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { RequestHistory } from '../../../shared/models/request-history.model';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';

@Component({
  selector: 'app-client-home',
  imports: [CommonModule],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css',
})
export class ClientHomeComponent {
  client: Client | undefined;

  requests: MaintenanceRequest[] = [];

  constructor(
    private clientService: ClientService,
    private loginService: LoginService,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService,
  ) {
    if (this.loginService.getLoggedUserType() !== 'CLIENT') {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.loginService.getLoggedUserId();

    this.client = this.clientService.findById(id);

    this.requests = maintenanceRequestService.findByClientId(id);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'ABERTA';

      case 'QUOTED':
        return 'ORÇADA';

      case 'APPROVED':
        return 'APROVADA';

      case 'REJECTED':
        return 'REJEITADA';

      case 'REDIRECTED':
        return 'REDIRECIONADA';

      case 'FIXED':
        return 'ARRUMADA';

      case 'PAID':
        return 'PAGA';

      case 'FINALIZED':
        return 'FINALIZADA';

      default:
        return status;
    }
  }

  logout(): void {
    this.loginService.logout();

    this.router.navigate(['/login']);
  }
  OpenTicket(): void {
    this.router.navigate(['/client/equipment-repair']);
  }

  openRequest(requestId: number): void {
    this.router.navigate(['/client/request-details', requestId]);
  }

  openQuote(requestId: number): void {
    this.router.navigate(['/client/quote-approval', requestId]);
  }

  canReviewQuote(request: MaintenanceRequest): boolean {
    if (request.status === RequestStatus.APPROVED || request.status === RequestStatus.REJECTED) {
      return false;
    }

    return request.status === RequestStatus.QUOTED ||
      this.quoteService.findByRequestId(request.id) !== undefined;
  }

  rescueRequest(requestId: number): void {
    const rescued = this.maintenanceRequestService.rescueRequest(requestId);

    if(!rescued){
      return;
    }

    const clientId = this.loginService.getLoggedUserId();

    this.requests = this.maintenanceRequestService.findByClientId(clientId);
  }

  payRequest(requestId: number): void {
    this.router.navigate(['/client/pay-request', requestId]);
  }
}

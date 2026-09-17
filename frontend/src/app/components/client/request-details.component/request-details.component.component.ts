import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from '../../../services/category.service';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { Quote } from '../../../shared/models/quote';
import { RequestHistory } from '../../../shared/models/request-history.model';

@Component({
  selector: 'app-request-details.component',
  imports: [CommonModule],
  templateUrl: './request-details.component.component.html',
  styleUrl: './request-details.component.component.css',
})
export class RequestDetailsComponentComponent {
  request: MaintenanceRequest | undefined;
  quote: Quote | undefined;
  categoryName = '';
  historyEntries: RequestHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService,
    private categoryService: CategoryService,
  ) {
    if (this.loginService.getLoggedUserType() !== 'CLIENT') {
      this.router.navigate(['/login']);
      return;
    }

    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    const request = this.maintenanceRequestService.findById(requestId);
    const clientId = this.loginService.getLoggedUserId();

    if (!request || request.clientId !== clientId) {
      this.router.navigate(['/client/home']);
      return;
    }

    this.request = request;
    this.quote = this.quoteService.findByRequestId(request.id);
    this.categoryName = this.categoryService.findById(request.categoryId)?.name ?? '';
    this.historyEntries = request.requestHistory ?? [];
  }

  getStatusLabel(status: RequestStatus): string {
    const labels: Record<RequestStatus, string> = {
      [RequestStatus.OPEN]: 'ABERTA',
      [RequestStatus.QUOTED]: 'ORÇADA',
      [RequestStatus.APPROVED]: 'APROVADA',
      [RequestStatus.REJECTED]: 'REJEITADA',
      [RequestStatus.REDIRECTED]: 'REDIRECIONADA',
      [RequestStatus.FIXED]: 'ARRUMADA',
      [RequestStatus.PAID]: 'PAGA',
      [RequestStatus.FINALIZED]: 'FINALIZADA',
    };

    return labels[status] ?? status;
  }

  getActionLabel(action: HistoryActions): string {
    const labels: Record<HistoryActions, string> = {
      [HistoryActions.REQUEST_CREATED]: 'Solicitação criada',
      [HistoryActions.QUOTE_CREATED]: 'Orçamento criado',
      [HistoryActions.QUOTE_APPROVED]: 'Orçamento aprovado',
      [HistoryActions.QUOTE_REJECTED]: 'Orçamento rejeitado',
      [HistoryActions.REQUEST_RESCUED]: 'Solicitação resgatada',
      [HistoryActions.MAINTENANCE_REDIRECTED]: 'Manutenção redirecionada',
      [HistoryActions.MAINTENANCE_COMPLETED]: 'Manutenção concluída',
      [HistoryActions.PAYMENT_CONFIRMED]: 'Pagamento confirmado',
      [HistoryActions.REQUEST_FINALIZED]: 'Solicitação finalizada',
    };

    return labels[action] ?? action;
  }

  canReviewQuote(): boolean {
    return this.request?.status === RequestStatus.QUOTED && this.quote !== undefined;
  }

  openQuote(): void {
    if (this.request) {
      this.router.navigate(['/client/quote-approval', this.request.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/client/home']);
  }
}

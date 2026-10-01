import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CategoryService } from '../../../services/category.service';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { Quote } from '../../../shared/models/quote';

@Component({
  selector: 'app-pay-request',
  imports: [CommonModule, RouterLink],
  templateUrl: './pay-request.component.html',
  styleUrl: './pay-request.component.css',
})
export class PayRequestComponent {
  request: MaintenanceRequest | undefined;
  quote: Quote | undefined;
  categoryName = '';
  message = '';
  paymentConfirmed = false;

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

    if (!request || request.clientId !== clientId || request.status !== RequestStatus.FIXED) {
      this.router.navigate(['/client/home']);
      return;
    }

    this.request = request;
    this.quote = this.quoteService.findByRequestId(request.id);
    this.categoryName = this.categoryService.findById(request.categoryId)?.name ?? '';
  }

  confirmPayment(): void {
    if (!this.request) {
      return;
    }

    const paid = this.maintenanceRequestService.payRequest(this.request.id);

    if (!paid) {
      this.message = 'Esta solicitação não está disponível para pagamento.';
      return;
    }

    this.request.status = RequestStatus.PAID;
    this.paymentConfirmed = true;
    this.message = 'Pagamento confirmado com sucesso.';
  }
}

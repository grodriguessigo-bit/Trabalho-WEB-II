import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';
import { LoginService } from '../../../services/login.service';
import { Quote } from '../../../shared/models/quote';
import { RequestHistory } from '../../../shared/models/request-history.model';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';
import { RequestStatus } from '../../../shared/enum/request-status.enum';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent {

  client: MaintenanceRequest | undefined;
  price = 0;
  message = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService,
    private loginService: LoginService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.client = this.maintenanceRequestService.findById(id);
  }

  generateBudget() {
    if (!this.client || this.price <= 0) {
      this.message = 'Informe um valor válido para o orçamento.';
      return;
    }

    const quoteDateTime = new Date().toISOString();
    const previousStatus = this.client.status;

    this.quoteService.insert(
      new Quote(
        0,
        this.client.id,
        this.loginService.getLoggedUserId(),
        this.price,
        quoteDateTime,
      ),
    );

    this.client.status = RequestStatus.QUOTED;
    this.client.requestHistory ??= [];
    this.client.requestHistory.push(
      new RequestHistory(
        this.client.requestHistory.length + 1,
        HistoryActions.QUOTE_CREATED,
        previousStatus,
        RequestStatus.QUOTED,
        quoteDateTime,
        'Orçamento criado no valor de R$ ' + this.price.toFixed(2),
      ),
    );

    this.maintenanceRequestService.update(this.client);

    this.router.navigate(['/employee/home']);
  }
}
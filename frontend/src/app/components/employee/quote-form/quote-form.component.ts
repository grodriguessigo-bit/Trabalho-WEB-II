import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { RequestHistory } from '../../../shared/models/request-history.model';
import { Quote } from '../../../shared/models/quote';
import { Client } from '../../../shared/models/client.model';

import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';

import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';
import { LoginService } from '../../../services/login.service';
import { EmployeeService } from '../../../services/employee.service';
import { ClientService } from '../../../services/client.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-quote-form',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.css',
})
export class QuoteFormComponent {

  request: MaintenanceRequest | undefined;

  client: Client | undefined;

  categoryName: string = '';

  price: number = 0;

  quoteDescription: string = '';

  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService,
    private loginService: LoginService,
    private employeeService: EmployeeService,
    private clientService: ClientService,
    private categoryService: CategoryService
  ) {

    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.request =
      this.maintenanceRequestService.findById(id);

    if (!this.request) {
      this.router.navigate(['/employee/home']);
      return;
    }

    this.client =
      this.clientService.findById(
        this.request.clientId
      );

    const category =
      this.categoryService.findById(
        this.request.categoryId
      );

    if (category) {
      this.categoryName = category.name;
    }
  }

  createQuote(): void {

    if (!this.request) {
      return;
    }

    if (this.price <= 0) {
      this.message = 'Informe um valor válido.';
      return;
    }

    if (!this.quoteDescription.trim()) {
      this.message = 'Informe a descrição do orçamento.';
      return;
    }

    if (this.request.status !== RequestStatus.OPEN) {
      this.message = 'Esta solicitação não está aberta.';
      return;
    }

    const employeeId =
      this.loginService.getLoggedUserId();

    const employee =
      this.employeeService.findById(employeeId);

    const quoteDateTime =
      new Date().toISOString();

    const quote = new Quote(
      0,
      this.request.id,
      employeeId,
      this.price,
      this.quoteDescription.trim(),
      quoteDateTime
    );

    this.quoteService.insert(quote);

    const previousStatus =
      this.request.status;

    this.request.status =
      RequestStatus.QUOTED;

    const history = new RequestHistory(
      this.request.requestHistory.length + 1,
      HistoryActions.QUOTE_CREATED,
      previousStatus,
      RequestStatus.QUOTED,
      quoteDateTime,
      'Orçamento criado no valor de R$ ' + this.price.toFixed(2),
      employee ? employee.name : ''
    );

    this.request.requestHistory.push(history);

    this.maintenanceRequestService.update(
      this.request
    );

    this.router.navigate(['/employee/home']);
  }

}

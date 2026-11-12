import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';

import { RequestStatus } from '../../../shared/enum/request-status.enum';
import {
  EmployeeRequestDetailsDTO,
  STATUS_LABELS
} from '../../../shared/models/request-api.model';

@Component({
  selector: 'app-quote-form',
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.css'
})
export class QuoteFormComponent implements OnInit {
  request = signal<EmployeeRequestDetailsDTO | null>(null);
  message = signal('');
  price = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const requestId = Number(this.route.snapshot.paramMap.get('id'));

    this.maintenanceRequestService.getEmployeeDetails(requestId).subscribe({
      next: response => {
        if (!response.data || response.data.status !== RequestStatus.OPEN) {
          this.router.navigate(['/employee/home']);
          return;
        }

        this.request.set(response.data);
      },
      error: () => {
        this.router.navigate(['/employee/home']);
      }
    });
  }

  getStatusLabel(status: RequestStatus): string {
    return STATUS_LABELS[status];
  }

  createQuote(): void {
    const request = this.request();

    if (!request) {
      return;
    }

    if (this.price <= 0) {
      this.message.set('Informe um valor válido.');
      return;
    }

    this.message.set('');

    this.quoteService.create(request.requestId, this.price).subscribe({
      next: () => {
        this.router.navigate(['/employee/home']);
      },
      error: error => {
        this.message.set(
          error.error?.message ??
          'Não foi possível registrar o orçamento.'
        );
      }
    });
  }
}
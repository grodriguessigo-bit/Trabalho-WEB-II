import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { Quote } from '../../../shared/models/quote';
import { QuoteService } from '../../../services/quote.service';

@Component({
  selector: 'app-budget-rejected',
  templateUrl: './budget_rejected.component.html',
  imports: [CommonModule],
  styleUrls: ['./budget_rejected.component.css']
})
export class BudgetRejectedComponent {
  request?: MaintenanceRequest;
  quote?: Quote;

  constructor(
    private router: Router,
    route: ActivatedRoute,
    requestService: MaintenanceRequestService,
    quoteService: QuoteService,
  ) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.request = requestService.findById(id);
    this.quote = quoteService.findByRequestId(id);
  }

  goBack(): void {
    this.router.navigate(['/employee/home']);
  }
}
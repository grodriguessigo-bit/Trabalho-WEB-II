import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent {

  client: MaintenanceRequest | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private maintenanceRequestService: MaintenanceRequestService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.client = this.maintenanceRequestService.findById(id);
  }

  generateBudget() {
    console.log('Orçamento gerado para a solicitação:', this.client);

    this.router.navigate(['/employee/home']);
  }
}
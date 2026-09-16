import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { RequestStatus } from '../../../shared/enum/request-status.enum';
import { HistoryActions } from '../../../shared/enum/history-actions.enum';
import { RequestHistory } from '../../../shared/models/request-history.model';
import { LoginService } from '../../../services/login.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { Category } from '../../../shared/models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-client-equipament-repair',
  imports: [FormsModule],
  templateUrl: './client-equipment-repair.component.html',
  styleUrls: ['./client-equipment-repair.component.css'],
})

export class ClientEquipmentRepairComponent {
  equipmentCategories: Category[] = [];

  //MOCK para teste
  mockRequest = new MaintenanceRequest(
    0,
    1,
    1,
    'Notebook Dell Inspiron',
    'O equipamento não liga',
    new Date().toISOString(),
    RequestStatus.OPEN,
    [
      new RequestHistory(
        0,
        HistoryActions.REQUEST_CREATED,
        null,
        RequestStatus.OPEN,
        new Date().toISOString(),
        'Maintenance request created',
        'João',
      ),
    ],
  );

  request = new MaintenanceRequest();

  constructor(
    private router: Router,
    private loginService: LoginService,
    private maintenanceRequestService: MaintenanceRequestService,
    private categoryService: CategoryService,
  ) {
    this.equipmentCategories = this.categoryService
      .listAll()
      .filter(category => category.active);
  }

  createRequest(): void {
    if (
      !this.request.equipmentDescription ||
      !this.request.defectDescription ||
      this.request.equipmentDescription.length > 30 ||
      !this.request.categoryId
    ) {
      // faz a validação dos campos antes de cadastrar o reparo
      alert('Por favor, preencha todos os campos antes de cadastrar o reparo.');
      return;
    }

    const clientId = this.loginService.getLoggedUserId();

    if (!clientId) {
      alert('Cliente não identificado.');
      this.router.navigate(['/login']);
      return;
    }

    this.request.clientId = clientId;

    this.request.requestDateTime = new Date().toISOString();

    this.request.status = RequestStatus.OPEN;

    const history = new RequestHistory(
      0,
      HistoryActions.REQUEST_CREATED,
      null,
      RequestStatus.OPEN,
      new Date().toISOString(),
      'Solicitação de manutenção criada',
    );

    this.request.requestHistory.push(history);

    this.maintenanceRequestService.insert(this.request);

    this.router.navigate(['/client/home']);
  }

  goBack(): void {
    this.router.navigate(['/client/home']);
  }
}

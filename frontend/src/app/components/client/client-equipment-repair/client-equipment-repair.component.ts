import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
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
  equipmentCategories = signal<Category[]>([]);
  message = signal('');
  saving = signal(false);

  request = new MaintenanceRequest();

  constructor(
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService,
    private categoryService: CategoryService,
  ) {
    this.categoryService.listAll().subscribe({
      next: response => {
        if (!response.success) {
          this.message.set(response.message);
          return;
        }

        this.equipmentCategories.set(
          response.data.filter(category => category.active)
        );
      },
      error: error => {
        this.message.set(
          error.error?.message ??
          'Não foi possível carregar as categorias.'
        );
      }
    });
  }

  createRequest(): void {
    if (this.saving()) {
      return;
    }

    const equipmentDescription =
      this.request.equipmentDescription.trim();

    const defectDescription =
      this.request.defectDescription.trim();

    const categoryId = Number(this.request.categoryId);

    if (!equipmentDescription || !defectDescription || !categoryId) {
      this.message.set('Preencha todos os campos.');
      return;
    }

    this.message.set('');
    this.saving.set(true);

    this.maintenanceRequestService.createRequest({
      equipmentDescription,
      defectDescription,
      categoryId
    }).subscribe({
      next: response => {
        this.saving.set(false);

        if (!response.success) {
          this.message.set(response.message);
          return;
        }

        alert(response.message);
        this.router.navigate(['/client/home']);
      },
      error: error => {
        this.saving.set(false);

        this.message.set(
          error.status === 401
            ? 'Sua sessão expirou. Entre novamente.'
            : error.error?.message ??
              'Não foi possível cadastrar a solicitação.'
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/client/home']);
  }
}

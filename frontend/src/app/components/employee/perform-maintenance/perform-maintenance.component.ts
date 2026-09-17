import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { RequestService, RequestItem } from '../../../services/request.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-perform-maintenance',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perform-maintenance.component.html',
  styleUrl: './perform-maintenance.component.css',
})
export class PerformMaintenanceComponent implements OnInit {

  request!: RequestItem;
  maintenanceDescription: string = "";
  clientGuidelines: string = "";
  message: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private loginService: LoginService
  ) {
    if (this.loginService.getLoggedUserType() !== "EMPLOYEE") {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const found = this.requestService.findById(Number(idParam));
      if (found) {
        this.request = found;
      } else {
        this.message = "Solicitação não encontrada.";
      }
    }
  }

  performMaintenance(): void {
    if (!this.maintenanceDescription || !this.clientGuidelines) {
      this.message = "Preencha a descrição da manutenção e as orientações para o cliente.";
      return;
    }

    const employeeId = this.loginService.getLoggedUserId();

    const success = this.requestService.performMaintenance(
      this.request.id,
      this.maintenanceDescription,
      this.clientGuidelines,
      employeeId
    );

    if (success) {
      alert("Manutenção registrada com sucesso! Estado alterado para ARRUMADA.");
      this.router.navigate(['/employee/home']);
    } else {
      this.message = "Erro ao registrar a manutenção.";
    }
  }

  redirect(): void {
    this.router.navigate(['/employee/request/redirect', this.request.id]);
  }

}
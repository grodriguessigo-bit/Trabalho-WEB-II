import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { ClientService } from '../../../services/client.service';
import { LoginService } from '../../../services/login.service';

import { MaintenanceRequest } from '../../../shared/models/maintenance-request';
import { Client } from '../../../shared/models/client.model';
import { RequestStatus } from '../../../shared/enum/request-status.enum';

@Component({
  selector: 'app-perform-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perform-maintenance.component.html',
  styleUrl: './perform-maintenance.component.css'
})
export class PerformMaintenanceComponent implements OnInit {
  requestId!: number;
  request?: MaintenanceRequest;
  client?: Client;

  maintenanceDescription: string = '';
  clientGuidelines: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: MaintenanceRequestService,
    private clientService: ClientService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.requestId = Number(idParam);
      this.loadData();
    } else {
      this.router.navigate(['/employee/home']);
    }
  }

  loadData(): void {
    const req = this.requestService.findById(this.requestId);
    
    if (req) {
      this.request = req;      
      if (req.clientId) {
        this.client = this.clientService.findById(req.clientId);
      }
    } else {
      this.message = 'Solicitação não encontrada.';
    }
  }

  performMaintenance(): void {
    if (!this.request) return;

    this.request.status = RequestStatus.FIXED; 
    this.requestService.update(this.request);
    this.router.navigate(['/employee/home']);
  }

  redirect(): void {
    if (!this.request) return;
    this.router.navigate(['/employee/request/redirect', this.request.id]);
  }
}
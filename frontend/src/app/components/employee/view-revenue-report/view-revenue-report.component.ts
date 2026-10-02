import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { ClientService } from '../../../services/client.service';
import { EmployeeService } from '../../../services/employee.service';
import { RequestStatus } from '../../../shared/enum/request-status.enum';

@Component({
  selector: 'app-view-revenue-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-revenue-report.component.html',
  styleUrl: './view-revenue-report.component.css',
})
export class ViewRevenueReportComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  filteredRequests: any[] = [];
  totalRevenue: number = 0;
  message: string = '';

  constructor(
    private requestService: MaintenanceRequestService,
    private clientService: ClientService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

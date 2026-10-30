import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CategoryService } from '../../../services/category.service';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { QuoteService } from '../../../services/quote.service';

import { Category } from '../../../shared/models/category.model';
import { RequestStatus } from '../../../shared/enum/request-status.enum';

@Component({
  selector: 'app-view-revenue-report-by-category',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './view-revenue-report-by-category.component.html',
  styleUrl: './view-revenue-report-by-category.component.css',
})
export class ViewRevenueReportByCategoryComponent implements OnInit {

  categories: Category[] = [];

  selectedCategoryId: number | null = null;

  totalRevenue: number = 0;

  requestsCount: number = 0;

  message: string = '';

  showResult: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private maintenanceRequestService: MaintenanceRequestService,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    this.categories =
      this.categoryService
        .listAll()
        .filter(category => category.active);
  }

  filterReport(): void {

    this.message = '';
    this.totalRevenue = 0;
    this.requestsCount = 0;
    this.showResult = false;

    if (this.selectedCategoryId === null) {
      this.message = 'Selecione uma categoria.';
      return;
    }

    const requests =
      this.maintenanceRequestService
        .listAll()
        .filter(request =>
          request.categoryId === this.selectedCategoryId &&
          (
            request.status === RequestStatus.PAID ||
            request.status === RequestStatus.FINALIZED
          )
        );

    this.requestsCount = requests.length;

    requests.forEach(request => {

      const quote =
        this.quoteService.findByRequestId(
          request.id
        );

      if (quote) {
        this.totalRevenue += quote.price;
      }

    });

    this.showResult = true;

    if (this.requestsCount === 0) {
      this.message =
        'Nenhuma receita encontrada para esta categoria.';
    }
  }
}
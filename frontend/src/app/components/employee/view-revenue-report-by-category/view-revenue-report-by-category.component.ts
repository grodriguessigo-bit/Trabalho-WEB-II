import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-view-revenue-report-by-category',
  imports: [
    FormsModule,
    RouterModule
  ],
  templateUrl: './view-revenue-report-by-category.component.html',
  styleUrl: './view-revenue-report-by-category.component.css',
})
export class ViewRevenueReportByCategoryComponent implements OnInit {

  categories: Category[] = [];

  selectedCategoryId: number | null = null;

  constructor(
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categories =
      this.categoryService
        .listAll()
        .filter(category => category.active);
  }
}
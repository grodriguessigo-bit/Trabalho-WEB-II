import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Category } from '../../../shared/models/category.model';
import { CategoryService } from '../../../services/category.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-categories',
  imports: [RouterModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {

  categories: Category[] = [];
  showModal = false;
  showDeactivateModal = false;
  showOnlyActive = false;
  categoryName = '';
  editingCategory: Category | undefined;
  categoryToDeactivate: Category | undefined;
  message = '';

  constructor(
    private categoryService: CategoryService,
    private loginService: LoginService,
    private router: Router
  ) {
    if (this.loginService.getLoggedUserType() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
      return;
    }

    this.listAll();
  }

  listAll(): void {
    this.categories = this.categoryService.listAll();
  }

  get displayedCategories(): Category[] {
    if (this.showOnlyActive) {
      return this.categories.filter(category => category.active);
    }

    return this.categories;
  }

  toggleActiveFilter(): void {
    this.showOnlyActive = !this.showOnlyActive;
  }

  openCreateModal(): void {
    this.editingCategory = undefined;
    this.categoryName = '';
    this.message = '';
    this.showModal = true;
  }

  openEditModal(category: Category): void {
    this.editingCategory = category;
    this.categoryName = category.name;
    this.message = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCategory = undefined;
    this.categoryName = '';
    this.message = '';
  }

  save(): void {
    const name = this.categoryName.trim();

    if (!name) {
      this.message = 'Digite o nome da categoria.';
      return;
    }

    const categoryAlreadyExists = this.categories.some(
      category => category.active
        && category.id !== this.editingCategory?.id
        && category.name.trim().toLowerCase() === name.toLowerCase()
    );

    if (categoryAlreadyExists) {
      this.message = 'Já existe uma categoria ativa com esse nome.';
      return;
    }

    if (this.editingCategory) {
      this.categoryService.update(
        new Category(this.editingCategory.id, name, this.editingCategory.active)
      );
    } else {
      this.categoryService.insert(new Category(0, name, true));
    }

    this.listAll();
    this.closeModal();
  }

  openDeactivateModal(category: Category): void {
    this.categoryToDeactivate = category;
    this.showDeactivateModal = true;
  }

  closeDeactivateModal(): void {
    this.showDeactivateModal = false;
    this.categoryToDeactivate = undefined;
  }

  confirmDeactivation(): void {
    if (this.categoryToDeactivate) {
      this.categoryService.remove(this.categoryToDeactivate.id);
      this.listAll();
    }

    this.closeDeactivateModal();
  }

  activate(category: Category): void {
    this.categoryService.activate(category.id);
    this.listAll();
  }
}

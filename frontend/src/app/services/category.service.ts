import { Injectable } from '@angular/core';
import { Category } from '../shared/models/category.model';

const LS_KEY = 'categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  listAll(): Category[] {
    const categories = localStorage[LS_KEY];

    if (categories) {
      return JSON.parse(categories);
    }

    return [
      new Category(1, 'Notebook', true),
      new Category(2, 'Desktop', true),
      new Category(3, 'Impressora', true),
      new Category(4, 'Mouse', true),
      new Category(5, 'Teclado', true),
    ];
  }

  insert(category: Category): void {
    const categories = this.listAll();

    category.id = new Date().getTime();

    categories.push(category);

    localStorage[LS_KEY] = JSON.stringify(categories);
  }

  findById(id: number): Category | undefined {
    const categories = this.listAll();

    return categories.find(category => category.id === id);
  }

  update(category: Category): void {
    const categories = this.listAll();

    const index = categories.findIndex(
      item => item.id === category.id
    );

    if (index !== -1) {
      categories[index] = category;

      localStorage[LS_KEY] = JSON.stringify(categories);
    }
  }

  remove(id: number): void {
    const category = this.findById(id);

    if (category) {
      category.active = false;

      this.update(category);
    }
  }

  activate(id: number): void {
    const category = this.findById(id);

    if (category) {
      category.active = true;

      this.update(category);
    }
  }

}

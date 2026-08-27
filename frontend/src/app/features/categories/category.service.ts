import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/categories';

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  create(nome: string): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, { nome });
  }

  update(id: number, nome: string): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, { nome });
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activate(id: number): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}/activate`, {});
  }
}

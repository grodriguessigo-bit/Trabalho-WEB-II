import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../shared/models/category.model';
import { ApiResponse } from '../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  //PRECISA CRIAR UMA ROTA GLOBAL PARA A PORTA 8090 para ser utilizada por todo mundo
  private readonly apiUrl = 'http://localhost:8090/categories';

  constructor(private http: HttpClient) {}

  listAll(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl);
  }

  listForEmployee(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/employee`,
      { withCredentials: true });
  }

  findById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`);
  }

  insert(category: Category): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, category, { withCredentials: true });
  }

  update(category: Category): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${category.id}`, category, { withCredentials: true });
  }

  remove(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}

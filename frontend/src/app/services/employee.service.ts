import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Formato da resposta do backend (ApiResponse). Confira os nomes dos campos
// no JSON que apareceu no seu Postman e ajuste se forem diferentes.
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface EmployeeDTO {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  active: boolean;
}

export interface CreateEmployeeDTO {
  name: string;
  email: string;
  birthDate: string;
  password: string;
}

export interface UpdateEmployeeDTO {
  name: string;
  email: string;
  birthDate: string;
  newPassword?: string;
}

const API_URL = 'http://localhost:8090/employees';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  constructor(private http: HttpClient) {}

  listAll(): Observable<EmployeeDTO[]> {
    return this.http
      .get<ApiResponse<EmployeeDTO[]>>(API_URL)
      .pipe(map(res => res.data));
  }

  findById(id: number): Observable<EmployeeDTO> {
    return this.http
      .get<ApiResponse<EmployeeDTO>>(`${API_URL}/${id}`)
      .pipe(map(res => res.data));
  }

  insert(employee: CreateEmployeeDTO): Observable<EmployeeDTO> {
    return this.http
      .post<ApiResponse<EmployeeDTO>>(API_URL, employee)
      .pipe(map(res => res.data));
  }

  update(id: number, employee: UpdateEmployeeDTO): Observable<EmployeeDTO> {
    return this.http
      .put<ApiResponse<EmployeeDTO>>(`${API_URL}/${id}`, employee)
      .pipe(map(res => res.data));
  }

  remove(id: number, loggedEmployeeId?: number): Observable<EmployeeDTO> {
    let headers = new HttpHeaders();
    if (loggedEmployeeId !== undefined) {
      headers = headers.set('X-Employee-Id', String(loggedEmployeeId));
    }

    return this.http
      .patch<ApiResponse<EmployeeDTO>>(`${API_URL}/${id}/deactivate`, null, { headers })
      .pipe(map(res => res.data));
  }
}
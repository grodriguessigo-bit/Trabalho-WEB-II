import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      .get<ApiResponse<EmployeeDTO[]>>(
        API_URL,
        { withCredentials: true }
      )
      .pipe(
        map(response => response.data)
      );
  }

  findById(id: number): Observable<EmployeeDTO> {
    return this.http
      .get<ApiResponse<EmployeeDTO>>(
        `${API_URL}/${id}`,
        { withCredentials: true }
      )
      .pipe(
        map(response => response.data)
      );
  }

  insert(employee: CreateEmployeeDTO): Observable<EmployeeDTO> {
    return this.http
      .post<ApiResponse<EmployeeDTO>>(
        API_URL,
        employee,
        { withCredentials: true }
      )
      .pipe(
        map(response => response.data)
      );
  }

  update(
    id: number,
    employee: UpdateEmployeeDTO
  ): Observable<EmployeeDTO> {

    return this.http
      .put<ApiResponse<EmployeeDTO>>(
        `${API_URL}/${id}`,
        employee,
        { withCredentials: true }
      )
      .pipe(
        map(response => response.data)
      );
  }

  remove(id: number): Observable<EmployeeDTO> {
    return this.http
      .patch<ApiResponse<EmployeeDTO>>(
        `${API_URL}/${id}/deactivate`,
        null,
        { withCredentials: true }
      )
      .pipe(
        map(response => response.data)
      );
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly apiUrl =
    'http://localhost:8090/payments';

  constructor(
    private http: HttpClient
  ) {}

  pay(requestId: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/request/${requestId}`, {}, { withCredentials: true });
  }
}
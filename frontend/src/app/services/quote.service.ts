import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/api-response.model';
import { QuoteDTO } from '../shared/models/request-api.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private readonly apiUrl =
    'http://localhost:8090/quotes';

  constructor(
    private http: HttpClient
  ) {}

  create(
    requestId: number,
    price: number
  ): Observable<ApiResponse<QuoteDTO>> {

    return this.http.post<ApiResponse<QuoteDTO>>(
      `${this.apiUrl}/request/${requestId}`,
      { price },
      { withCredentials: true }
    );
  }

  findByRequestId(
    requestId: number
  ): Observable<ApiResponse<QuoteDTO>> {

    return this.http.get<ApiResponse<QuoteDTO>>(
      `${this.apiUrl}/request/${requestId}`,
      { withCredentials: true }
    );
  }

  approve(
    requestId: number
  ): Observable<ApiResponse<null>> {

    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/request/${requestId}/approve`,
      {},
      { withCredentials: true }
    );
  }

  reject(
    requestId: number,
    reason: string
  ): Observable<ApiResponse<null>> {

    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/request/${requestId}/reject`,
      { reason },
      { withCredentials: true }
    );
  }
}
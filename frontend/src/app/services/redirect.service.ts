import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  private readonly apiUrl = 'http://localhost:8090/redirects';

  constructor(private http: HttpClient) {}

  redirect(requestId: number, destinationEmployeeId: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/request/${requestId}`,
      { destinationEmployeeId },
      { withCredentials: true }
    );
  }
}
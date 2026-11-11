import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private readonly apiUrl = 'http://localhost:8090/maintenances';

  constructor(private http: HttpClient) {}

  perform(requestId: number, maintenanceDescription: string, clientInstructions: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/request/${requestId}`,
      { maintenanceDescription, clientInstructions },
      { withCredentials: true }
    );
  }
}
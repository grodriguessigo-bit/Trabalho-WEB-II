import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/api-response.model';
import { CategoryRevenueReport, DailyRevenueReport } from '../shared/models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly apiUrl = 'http://localhost:8090/reports';

  constructor(private http: HttpClient) {}

  getDailyRevenue(startDate?: string, endDate?: string): Observable<ApiResponse<DailyRevenueReport>> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<ApiResponse<DailyRevenueReport>>(`${this.apiUrl}/revenue-by-day`, {
      params,
      withCredentials: true,
    });
  }

  getRevenueByCategory(): Observable<ApiResponse<CategoryRevenueReport>> {
    return this.http.get<ApiResponse<CategoryRevenueReport>>(`${this.apiUrl}/revenue-by-category`, {
      withCredentials: true,
    });
  }
}

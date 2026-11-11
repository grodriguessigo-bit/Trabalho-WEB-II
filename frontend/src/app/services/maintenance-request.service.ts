import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/api-response.model';
import { ClientRequestDetailsDTO, ClientRequestSummaryDTO, CreateMaintenanceRequestDTO, EmployeeRequestDetailsDTO, EmployeeRequestSummaryDTO, RequestFilter} from '../shared/models/request-api.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestService {

  private readonly apiUrl =
    'http://localhost:8090/maintenance-requests';

  constructor(
    private http: HttpClient
  ) {}

  createRequest(
    request: CreateMaintenanceRequestDTO
  ): Observable<ApiResponse<ClientRequestSummaryDTO>> {

    return this.http.post<ApiResponse<ClientRequestSummaryDTO>>(
      this.apiUrl,
      request,
      { withCredentials: true }
    );
  }

  listClientRequests():
    Observable<ApiResponse<ClientRequestSummaryDTO[]>> {

    return this.http.get<ApiResponse<ClientRequestSummaryDTO[]>>(
      this.apiUrl,
      { withCredentials: true }
    );
  }

  getClientDetails(
    id: number
  ): Observable<ApiResponse<ClientRequestDetailsDTO>> {

    return this.http.get<ApiResponse<ClientRequestDetailsDTO>>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

  rescueRequest(
    id: number
  ): Observable<ApiResponse<null>> {

    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/${id}/rescue`,
      {},
      { withCredentials: true }
    );
  }

  listEmployeeRequests(
    filter: RequestFilter,
    startDate = '',
    endDate = ''
  ): Observable<ApiResponse<EmployeeRequestSummaryDTO[]>> {

    let params =
      new HttpParams().set('filter', filter);

    if (filter === 'PERIODO') {
      params = params
        .set('startDate', startDate)
        .set('endDate', endDate);
    }

    return this.http.get<ApiResponse<EmployeeRequestSummaryDTO[]>>(
      `${this.apiUrl}/employee`,
      {
        params,
        withCredentials: true
      }
    );
  }

  getEmployeeDetails(
    id: number
  ): Observable<ApiResponse<EmployeeRequestDetailsDTO>> {

    return this.http.get<ApiResponse<EmployeeRequestDetailsDTO>>(
      `${this.apiUrl}/employee/${id}`,
      { withCredentials: true }
    );
  }

  finalizeRequest(
    id: number
  ): Observable<ApiResponse<null>> {

    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/${id}/finalize`,
      {},
      { withCredentials: true }
    );
  }
}
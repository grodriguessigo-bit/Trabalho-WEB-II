import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Login } from '../shared/models/login.model';
import { LoggedUser } from '../shared/models/logged-user.model';
import { ApiResponse } from '../shared/models/api-response.model';

interface SessionUser {
  userId: number;
  name: string;
  email: string;
  profile: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = 'http://localhost:8090';

  private user: LoggedUser | null = null;

  constructor(private http: HttpClient) {}

  login(data: Login): Observable<ApiResponse<SessionUser>> {
    return this.http.post<ApiResponse<SessionUser>>(
      `${this.apiUrl}/login`,
      data,
      { withCredentials: true }
    );
  }

  restoreSession(): Observable<ApiResponse<SessionUser> | null> {
    return this.http.get<ApiResponse<SessionUser>>(
      `${this.apiUrl}/session`,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.user = new LoggedUser(
            response.data.userId,
            response.data.profile
          );
        } else {
          this.user = null;
        }
      }),
      catchError(() => {
        this.user = null;
        return of(null);
      })
    );
  }

  setLoggedUser(user: LoggedUser): void {
    this.user = user;
  }

  getLoggedUserId(): number {
    return this.user?.id ?? 0;
  }

  getLoggedUserType(): string {
    return this.user?.type ?? '';
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.clearLoggedUser();
      })
    );
  }

  clearLoggedUser(): void {
    this.user = null;
  }
}
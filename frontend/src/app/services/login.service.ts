import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../shared/models/login.model';
import { LoggedUser } from '../shared/models/logged-user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient) {}

  login(login: Login): Observable<{ data: { userId: number; profile: string } }> {
    return this.http.post<{ data: { userId: number; profile: string } }>(
      'http://localhost:8090/login',
      login,
      { withCredentials: true }
    );
  }

  setLoggedUser(user: LoggedUser): void {

    localStorage["loggedUserId"] =
      user.id.toString();

    localStorage["loggedUserType"] =
      user.type;
  }

  getLoggedUserId(): number {

    return Number(
      localStorage["loggedUserId"]
    );
  }

  getLoggedUserType(): string {

    return localStorage["loggedUserType"];
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      'http://localhost:8090/logout',
      {},
      { withCredentials: true }
    );
  }

  clearLoggedUser(): void {
    localStorage.removeItem('loggedUserId');
    localStorage.removeItem('loggedUserType');
  }

}
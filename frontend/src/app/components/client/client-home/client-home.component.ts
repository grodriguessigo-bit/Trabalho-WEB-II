import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../shared/models/client.model';
import { ClientService } from '../../../services/client.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-client-home',
  imports: [],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css',
})
export class ClientHomeComponent {

  client: Client | undefined;

  constructor(
    private clientService: ClientService,
    private loginService: LoginService,
    private router: Router
  ) {

    if (this.loginService.getLoggedUserType() !== "CLIENT") {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.loginService.getLoggedUserId();

    this.client = this.clientService.findById(id);
  }

  logout(): void {
    this.loginService.logout();

    this.router.navigate(['/login']);
  }

}
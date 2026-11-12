import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { LoginService } from '../../services/login.service';
import { Login } from '../../shared/models/login.model';
import { LoggedUser } from '../../shared/models/logged-user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginData = new Login();
  message = signal('');
  loading = signal(false);

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userType = this.loginService.getLoggedUserType();

    if (userType === 'CLIENT') {
      this.router.navigate(['/client/home']);
      return;
    }

    if (userType === 'EMPLOYEE') {
      this.router.navigate(['/employee/home']);
      return;
    }

    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.message.set(params['error']);
      }
    });
  }

  login(): void {
    if (this.loading()) {
      return;
    }

    if (!this.loginData.email?.trim() || !this.loginData.password?.trim()) {
      this.message.set('Informe o e-mail e a senha.');
      return;
    }

    this.loginService.clearLoggedUser();
    this.loading.set(true);
    this.message.set('');

    this.loginService.login(this.loginData).subscribe({
      next: response => {
        this.loading.set(false);

        const user = new LoggedUser(response.data.userId, response.data.profile);
        this.loginService.setLoggedUser(user);

        if (user.type === 'CLIENT') {
          this.router.navigate(['/client/home']);
        } else if (user.type === 'EMPLOYEE') {
          this.router.navigate(['/employee/home']);
        }
      },
      error: error => {
        this.loading.set(false);

        if (error.status === 401) {
          this.message.set('E-mail ou senha inválidos.');
        } else {
          this.message.set('Não foi possível entrar. Tente novamente.');
        }
      }
    });
  }
}
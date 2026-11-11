import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Login } from '../../shared/models/login.model';
import { LoggedUser } from '../../shared/models/logged-user.model';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

  loginData: Login =
    new Login();

  message: string = '';

  loading: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const userType =
      this.loginService.getLoggedUserType();

    if (userType === 'CLIENT') {
      this.router.navigate([
        '/client/home'
      ]);

      return;
    }

    if (userType === 'EMPLOYEE') {
      this.router.navigate([
        '/employee/home'
      ]);

      return;
    }

    this.route.queryParams.subscribe(
      params => {

        if (params['error']) {
          this.message =
            params['error'];
        }

      }
    );
  }

  login(): void {
    if (this.loading) {
      return;
    }

    if (!this.loginData.email?.trim() || !this.loginData.password?.trim()) {
      this.message = 'Informe o e-mail e a senha.';
      return;
    }

    this.loginService.clearLoggedUser();
    this.loading = true;
    this.message = '';

    this.loginService.login(this.loginData).subscribe({
      next: resposta => {
        this.loading = false;
        this.cdr.markForCheck();

        const usuario = new LoggedUser(
          resposta.data.userId,
          resposta.data.profile
        );

        this.loginService.setLoggedUser(usuario);

        if (usuario.type === 'CLIENT') {
          this.router.navigate(['/client/home']);
        } else if (usuario.type === 'EMPLOYEE') {
          this.router.navigate(['/employee/home']);
        }
      },
      error: erro => {
        this.loading = false;
        this.cdr.markForCheck();

        if (erro.status === 401) {
          this.message = 'E-mail ou senha inválidos.';
        } else {
          this.message = 'Não foi possível entrar. Tente novamente.';
        }
      }
    });
  }

}
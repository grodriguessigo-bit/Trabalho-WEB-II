import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Login } from '../../shared/models/login.model';

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
    private route: ActivatedRoute
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

    this.loading = true;

    this.message = '';

    this.loginService
      .login(this.loginData)
      .subscribe(user => {

        this.loading = false;

        if (!user) {

          this.message =
            'E-mail ou senha inválidos.';

          return;
        }

        this.loginService
          .setLoggedUser(user);

        if (user.type === 'CLIENT') {

          this.router.navigate([
            '/client/home'
          ]);

          return;
        }

        if (user.type === 'EMPLOYEE') {

          this.router.navigate([
            '/employee/home'
          ]);
        }

      });
  }

}
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

  email: string = '';

  password: string = '';

  message: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    const userType =
      this.loginService.getLoggedUserType();

    if (userType === 'CLIENT') {
      this.router.navigate(['/client/home']);
      return;
    }

    if (userType === 'EMPLOYEE') {
      this.router.navigate(['/employee/home']);
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

    const userType =
      this.loginService.login(
        this.email,
        this.password
      );

    if (userType === 'CLIENT') {
      this.router.navigate(['/client/home']);
      return;
    }

    if (userType === 'EMPLOYEE') {
      this.router.navigate(['/employee/home']);
      return;
    }

    this.message ='E-mail ou senha inválidos.';
  }

}
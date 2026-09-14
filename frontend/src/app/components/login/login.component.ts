import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  message: string = "";

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  login(): void {
    const userType = this.loginService.login(
      this.email,
      this.password
    );

    if (userType === "CLIENT") {
      this.router.navigate(['/client/home']);
      return;
    }

    if (userType === "EMPLOYEE") {
      this.router.navigate(['/employee/home']);
      return;
    }

    this.message = "E-mail ou senha inválidos.";
  }

}
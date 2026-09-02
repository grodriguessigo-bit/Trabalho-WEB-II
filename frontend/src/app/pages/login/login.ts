import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class LoginComponent {
  private status: string = '';

  botaoLogin(email: string, senha: string): void {
    if (!email.includes('@')) {
      this.status = 'E-mail inválido, não tem o "@" esperado'; //depois tem que arrumar pra um formato certo
      return;
    }

    this.status = 'Tentando login com e-mail "${email}" e senha "${senha}"';
  }

  get mensagem(): string {
    return this.status;
  }
}

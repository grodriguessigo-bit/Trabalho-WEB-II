import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Client } from '../../../shared/models/client.model';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-register-client',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css',
})
export class RegisterClientComponent {

  @ViewChild('formClient') formClient!: NgForm;

  client: Client = new Client();

  message: string = "";
  zipMessage: string = "";
  generatedPassword: string = "";

  constructor(
    private clientService: ClientService
  ) {}

  searchZipCode(): void {
    if (this.client.address.zipCode === "82940290") {

      this.client.address.zipCode = "82940-290";
      this.client.address.street = "Rua Hugo Cini";
      this.client.address.neighborhood = "Cajuru";
      this.client.address.city = "Curitiba";
      this.client.address.state = "PR";

      this.zipMessage = "CEP encontrado.";

    } else {
      this.zipMessage = "CEP não encontrado.";
    }
  }

  insert(): void {

    if (this.formClient.form.valid) {

      const clients = this.clientService.listAll();

      const exists = clients.find(
        client =>
          client.cpf === this.client.cpf ||
          client.email === this.client.email
      );

      if (exists) {
        this.message = "CPF ou e-mail já cadastrado.";
        return;
      }

      this.client.password = this.generatePassword();

      this.generatedPassword = this.client.password;

      this.clientService.insert(this.client);

      this.message = "Cliente cadastrado com sucesso.";

      this.client = new Client();

      this.formClient.reset();
    }
  }

  private generatePassword(): string {
    return Math.floor(
      1000 + Math.random() * 9000
    ).toString();
  }

}
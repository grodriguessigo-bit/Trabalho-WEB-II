import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Client } from '../../../shared/models/client.model';
import { ClientService } from '../../../services/client.service';
import { ViaCepService } from '../../../services/via-cep.service';

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
    private clientService: ClientService,
    private viaCepService: ViaCepService
  ) {}

  searchZipCode(): void {

    const zipCode = this.client.address.zipCode.replace(/\D/g, '');

    this.viaCepService.getZipCode(this.client.address.zipCode).subscribe((data) => {
      this.client.address.zipCode = data.cep;
      this.client.address.street = data.logradouro;
      this.client.address.neighborhood = data.bairro;
      this.client.address.city = data.localidade;
      this.client.address.state = data.uf;

      this.zipMessage = "CEP encontrado.";
    });
  }

  insert(): void {

    if (this.formClient.form.valid) {

      if (!this.client.address.street) {
        this.message = "Busque o CEP antes de cadastrar.";
        return;
      }

      this.clientService.insert(this.client).subscribe(
        client => {
          this.message = "Cliente cadastrado com sucesso.";
          this.client = new Client();
          this.formClient.reset()
        }
      )
    }
  };

  private generatePassword(): string {

    let password = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    return password;
  }

}
import { Component, ViewChild, signal } from '@angular/core';
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

  client = signal(new Client());

  message: string = "";
  zipMessage: string = "";
  generatedPassword: string = "";

  constructor(
    private clientService: ClientService,
    private viaCepService: ViaCepService
  ) {}

  searchZipCode(): void {

    const zipCode = this.client().address.zipCode.replace(/\D/g, '');

    this.viaCepService.getZipCode(zipCode).subscribe((data) => {

      this.client.update(client => {

        client.address.zipCode = data.cep;
        client.address.street = data.logradouro;
        client.address.neighborhood = data.bairro;
        client.address.city = data.localidade;
        client.address.state = data.uf;

        return new Client(
          client.id,
          client.name,
          client.email,
          client.password,
          client.active,
          client.cpf,
          client.phone,
          client.address
        );
      });

      this.zipMessage = "CEP encontrado.";
    });
  }

  insert(): void {

    if (this.formClient.form.valid) {

      if (!this.client().address.street) {
        this.message = "Busque o CEP antes de cadastrar.";
        return;
      }

      this.clientService.insert(this.client()).subscribe(
        client => {
          this.message = "Cliente cadastrado com sucesso.";
          this.client.set(new Client());
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
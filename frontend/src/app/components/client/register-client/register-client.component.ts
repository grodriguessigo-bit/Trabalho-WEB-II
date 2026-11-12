import { Component, ViewChild, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Client } from '../../../shared/models/client.model';
import { ClientService } from '../../../services/client.service';
import { ViaCepService } from '../../../services/via-cep.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-register-client',
  imports: [FormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css',
})
export class RegisterClientComponent {

  @ViewChild('formClient') formClient!: NgForm;

  client = signal(new Client());
  zipMessage = signal("");
  message = signal("");
  success = signal(false);

  constructor(
    private clientService: ClientService,
    private viaCepService: ViaCepService
  ) {}

  searchZipCode(): void {
    const zipCode = this.client().address.zipCode.replace(/\D/g, '');

    if (zipCode.length !== 8) {
      this.clearAddress();
      this.zipMessage.set("O CEP deve conter 8 números.");
      return;
    }

    this.viaCepService.getZipCode(zipCode).subscribe({
      next: (data) => {
        if (data.erro) {
          this.clearAddress();
          this.zipMessage.set("CEP não encontrado.");
          return;
        }

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

        this.zipMessage.set("CEP encontrado.");
      },
      error: () => {
        this.clearAddress();
        this.zipMessage.set("Não foi possível consultar o CEP. Tente novamente.");
      }
    });
  }

  insert(): void {
    this.message.set('');
    this.success.set(false);

    if (!this.formClient.form.valid) {
      this.message.set('Preencha corretamente todos os campos obrigatórios.');
      return;
    }

    if (!this.client().address.street) {
      this.message.set('Busque o CEP antes de cadastrar.');
      return;
    }

    this.clientService.insert(this.client()).subscribe({
      next: data => {
        this.success.set(data.success);
        this.message.set(data.message);
      },
      error: error => {
        this.success.set(false);
        this.message.set(
          error.error?.message ??
          'Não foi possível cadastrar. Tente novamente.'
        );
      }
    });
  }

  clearAddress(): void {
    this.client().address.street = "";
    this.client().address.neighborhood = "";
    this.client().address.city = "";
    this.client().address.state = "";
    this.zipMessage.set("");
  }


}
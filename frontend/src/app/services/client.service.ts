import { Injectable } from '@angular/core';
import { Client } from '../shared/models/client.model';
import { Address } from '../shared/models/address.model';

const LS_KEY = "clients";

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  listAll(): Client[] {
    const clients = localStorage[LS_KEY];

    if (clients) {
      return JSON.parse(clients);
    }

    return [
      new Client(
        1,
        "11122233344",
        "João",
        "joao@teste.com",
        "41999999999",
        "1234",
        new Address(
          "82940-290",
          "Rua Hugo Cini",
          "",
          "",
          "Cajuru",
          "Curitiba",
          "PR"
        )
      )
    ];
  }

  insert(client: Client): void {
    const clients = this.listAll();

    client.id = new Date().getTime();

    clients.push(client);

    localStorage[LS_KEY] = JSON.stringify(clients);
  }

  findById(id: number): Client | undefined {
    const clients = this.listAll();

    return clients.find(client => client.id === id);
  }

  findByEmail(email: string): Client | undefined {
    const clients = this.listAll();

    return clients.find(client => client.email === email);
  }

}
import { Injectable } from '@angular/core';
import { Client } from '../shared/models/client.model';
import { Address } from '../shared/models/address.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const LS_KEY = "clients";

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  BASE_URL = "http://localhost:8090/clients";

  httpOptions = {
    headers: new HttpHeaders ({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {}

  insert(client: Client): Observable<{ message: string; success: boolean }> {
    const body = {
      cpf: client.cpf.replace(/\D/g, ''),
      name: client.name.trim(),
      email: client.email.trim(),
      phone: client.phone.replace(/\D/g, ''),
      address: {
        zipCode: client.address.zipCode.replace(/\D/g, ''),
        street: client.address.street.trim(),
        number: client.address.number.trim(),
        complement: client.address.complement.trim(),
        neighborhood: client.address.neighborhood.trim(),
        city: client.address.city.trim(),
        state: client.address.state.trim()
      }
    };

    return this.httpClient.post<{ message: string; success: boolean }>(
      this.BASE_URL,
      body,
      this.httpOptions
    );
  }

  alter(client: Client): Observable<Client> {
    return this.httpClient.put<Client>(this.BASE_URL + "/" + client.id, JSON.stringify(client), this.httpOptions);
  }

  remove(id: number): Observable<Client> {
    return this.httpClient.delete<Client>(this.BASE_URL + "/" + id, this.httpOptions);
  }

  //listAll(): Observable<Client[]> {
  //  return this.httpClient.get<Client[]>(this.BASE_URL, this.httpOptions);
  //}

  //findById(id: number): Observable<Client> {
  //  return this.httpClient.get<Client>(this.BASE_URL + "/" + id, this.httpOptions)
  //}

  listAll(): Client[] {

    const clients = localStorage[LS_KEY];

    if (clients) {
      return JSON.parse(clients);
    }

    return [];
  }

  findById(id: number): Client | undefined {

    const clients = this.listAll();

    return clients.find(
      client => client.id === id
    );
  }

  findByEmail(email: string): Client | undefined {

    const clients = this.listAll();

    return clients.find(
      client => client.email === email
    );
  }

}
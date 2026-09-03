import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ViaCepResult } from '../models/ViaCepResult';

@Injectable({
  providedIn: 'root',
})

export class ViacepService {
  private readonly apiUrl: string = environment.viaCepUrl;
  constructor(private readonly http: HttpClient) {

  }

  getEnderecoByCep(cep: string) {
    return this.http.get<ViaCepResult>(
      `${this.apiUrl}${cep}/json/`
    )

  }

}

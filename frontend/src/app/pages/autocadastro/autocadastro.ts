import { Component, inject, signal } from '@angular/core';
import { AutocadastroService } from '../../services';
import { ViacepService } from '../../services/viacep';
import { ViaCepResult } from '../../models/ViaCepResult';

@Component({
  selector: 'app-autocadastro',
  imports: [],
  templateUrl: './autocadastro.html',
  styleUrl: './autocadastro.scss',
})
export class AutocadastroComponent {
  private readonly autocadastroService = inject(AutocadastroService)
  private readonly viacepService = inject(ViacepService)

  enderecoViaCep = signal<ViaCepResult | null>(null);
  mensagemCep = signal('');
  statusCadastro: string = '';
  mensagemCadastro = signal('');

  botaoBuscarCep(cep: string): void {
    const cepLimpo = cep.replace(/\D/g, '');

    this.enderecoViaCep.set(null);
    this.mensagemCep.set('');

    this.validarCEP(cep);

    this.viacepService.getEnderecoByCep(cepLimpo).subscribe((endereco) => {
      if (endereco.erro) {
        this.mensagemCep.set('CEP não encontrado.');
        return;
      }

      this.enderecoViaCep.set(endereco);
      this.mensagemCep.set('CEP encontrado.');
    });
  }

  botaoEnviarAutocadastro(nome: string, cpf: string, email: string, cep: string, cidade:string, logradouro: string, bairro:string, uf: string, telefone: string): void {
      if (!nome || !cpf || !email || !cep || !cidade || !logradouro || !bairro || !uf || !telefone){
        this.mensagemCadastro.set('Todos os campo devem estar preenchidos.');
      }
      else if (!this.validarNome(nome)) {
        this.mensagemCadastro.set('O nome deve estar preenchido somente com letras');
      }
      else if (!this.validarEmail(email)) {
        this.mensagemCadastro.set('O nome deve estar preenchido somente com letras');
      }  
      else {
        this.mensagemCadastro.set('Cadastro realizado!')
      }
  }

  validarNome(nome: string): boolean {
    return /^[a-zA-Z]+$/.test(nome);
  }

  validarEmail(email: string): boolean {
    if (!email.includes('@') || !email.includes('.com')) {
      return false;
    }
    return true;
  }

  //validarCPF(): void {}

  validarCEP(cepLimpo: string): void {
    if (cepLimpo.length !== 8) {
      this.mensagemCep.set('O CEP precisa ter 8 números.');
      return;
    }
  }
  //validarTelefone();

}

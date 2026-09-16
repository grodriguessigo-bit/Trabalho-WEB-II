import { Component } from '@angular/core';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent {

  client = {
    dateRequested: '01/01/2024',
    clientName: 'João da silva',
    clientEquipament: 'Notebook Dell',
    clientDescription: 'Notebook Dell com problema na tela'
  }

  generateBudget() {
    // Lógica para gerar o orçamento
    console.log('Orçamento gerado para o cliente:', this.client.clientName);
  }

}
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-equipament-repair',
  imports: [FormsModule],
  templateUrl: './client-equipament-repair.component.html',
  styleUrls: ['./client-equipament-repair.component.css']
})

export class ClientEquipamentRepairComponent {

    repair = {
        description: '',
        defectDescription: '',
        category: '',
        localDate  : new Date().toISOString().split('T')[0] // Inicializa com a data atual no formato YYYY-MM-DD
    };

    equipamentCategories = Object.keys(EquipamentCategory).map(key => ({
        chave: key,
        rotulo: EquipamentCategory[key as keyof typeof EquipamentCategory]
    }));
    
    constructor(private router: Router) {}

    cadastrateRepair(): void {
        if(!this.repair.description || !this.repair.defectDescription || !this.repair.category) { // faz a validação dos campos antes de cadastrar o reparo
            alert('Por favor, preencha todos os campos antes de cadastrar o reparo.');
            return;
        }
        console.log('Reparo cadastrado:', this.repair);
        this.repair.localDate = new Date().toISOString().split('T')[0]; // Atualiza a data para o formato YYYY-MM-DD
        this.router.navigate(['/client/home']);
    }

    goBack(): void {
        this.router.navigate(['/client/home']);
    }

}

export enum EquipamentCategory {
    CELULAR = 'Celular',
    TABLET = 'Tablet',
    NOTEBOOK = 'Notebook',
    COMPUTADOR = 'Computador',
    TELEVISAO = 'Televisão',
    OUTROS = 'Outros'
}


import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChecklistItem {
  label: string;
  completed: boolean;
}

@Component({
  selector: 'app-maintenance-checklist',
  imports: [FormsModule],
  templateUrl: './maintenance-checklist.component.html',
  styleUrl: './maintenance-checklist.component.css',
})
export class MaintenanceChecklistComponent {
  readonly initialItems: ChecklistItem[] = [
    { label: 'Verifique se o equipamento está conectado à energia.', completed: false },
    { label: 'Anote quando o problema começou e com que frequência acontece.', completed: false },
    { label: 'Registre mensagens de erro ou ruídos incomuns.', completed: false },
    { label: 'Separe acessórios que possam ser necessários para o reparo.', completed: false },
  ];

  items: ChecklistItem[] = this.createItems();

  get completedCount(): number {
    return this.items.filter((item) => item.completed).length;
  }

  get progressPercentage(): number {
    return (this.completedCount / this.items.length) * 100;
  }

  get isComplete(): boolean {
    return this.completedCount === this.items.length;
  }

  resetChecklist(): void {
    this.items = this.createItems();
  }

  private createItems(): ChecklistItem[] {
    return this.initialItems.map((item) => ({ ...item }));
  }
}

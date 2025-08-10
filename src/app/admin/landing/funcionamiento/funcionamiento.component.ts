import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-funcionamiento',
  standalone: true,
  imports: [ReactiveFormsModule,ButtonModule,TableModule,FormsModule],
  templateUrl: './funcionamiento.component.html',
  styleUrl: './funcionamiento.component.css'
})
export class FuncionamientoComponent {
  funcionamientoform = new FormGroup({

  });
  funcionamientoTable: any[] = [];
  clonedTable: { [s: string]: any } = {};
  agregarItem(){

  }
  exportExcel(){

  }
  exportCsv(){

  }
  exportPdf(){

  }
  onRowEditInit(table: any) {
    this.clonedTable[table.id as string] = { ...table };
  }

  onRowEditSave(table: any) {

  }

  onRowEditCancel(table: any, index: number) {
    this.funcionamientoTable[index] = this.clonedTable[table.id as string];
    delete this.clonedTable[table.id as string];
  }

  onRowEditDelete(table: any, index: number){

  }
}

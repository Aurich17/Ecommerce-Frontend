import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quienes',
  standalone: true,
  imports: [ReactiveFormsModule,ButtonModule,TableModule,FormsModule],
  templateUrl: './quienes.component.html',
  styleUrl: './quienes.component.css'
})
export class QuienesComponent {
  quienesTable: any[] = []
  clonedTable: { [s: string]: any } = {};
  quienesform = new FormGroup({

  });
  agregarEntidad(){

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
    this.quienesTable[index] = this.clonedTable[table.id as string];
    delete this.clonedTable[table.id as string];
  }

  onRowEditDelete(table: any, index: number){

  }
}

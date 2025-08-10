import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  comentariosTable: any[] = [];
  comentariosform = new FormGroup({})
  clonedTable: { [s: string]: any } = {};
  exportExcel() {

  }
  exportCsv() {

  }
  exportPdf() {

  }
  onRowEditInit(table: any) {
    this.clonedTable[table.id as string] = { ...table };
  }

  onRowEditSave(table: any) {

  }

  onRowEditCancel(table: any, index: number) {
    this.comentariosTable[index] = this.clonedTable[table.id as string];
    delete this.clonedTable[table.id as string];
  }

  onRowEditDelete(table: any, index: number) {

  }
}

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
  onEditPoppup(){

  }
  onDeleteRow(){
    
  }
}

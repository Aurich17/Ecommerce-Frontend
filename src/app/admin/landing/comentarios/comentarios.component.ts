import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule,TagModule,DialogModule, DropdownModule, InputTextModule, InputTextareaModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css',
  providers: [MessageService],
})
export class ComentariosComponent {
  visible: boolean = false
  titulomantenimiento: string = 'Registrar Item'
  labelbtn: string = 'Guardar'
  loading: boolean = false
  addRegister: boolean = false
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
  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return 'secondary';
    }
  }
}

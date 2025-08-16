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
  onEditPoppup(){

  }
  onDeleteRow(){
    
  }
}

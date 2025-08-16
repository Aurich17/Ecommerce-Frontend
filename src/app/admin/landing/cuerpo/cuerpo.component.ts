import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cuerpo',
  standalone: true,
  imports: [CardModule, CommonModule, ReactiveFormsModule, TableModule, ButtonModule, FormsModule],
  templateUrl: './cuerpo.component.html',
  styleUrl: './cuerpo.component.css'
})
export class CuerpoComponent {
  caracteristicasTable: any[] = [];
  preguntasTable: any[] = [];
  clonedTableC: { [s: string]: any } = {};
  clonedTableP: { [s: string]: any } = {};
  onEditPoppupP(){

  }
  onDeleteRowP(){

  }
  onEditPoppupC(){

  }
  onDeleteRowC(){
    
  }
}

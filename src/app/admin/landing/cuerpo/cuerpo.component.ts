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
  onRowEditInitC(tableC: any) {
    this.clonedTableC[tableC.id as string] = { ...tableC };
  }

  onRowEditSaveC(tableC: any) {

  }

  onRowEditCancelC(tableC: any, index: number) {
    this.caracteristicasTable[index] = this.clonedTableC[tableC.id as string];
    delete this.clonedTableC[tableC.id as string];
  }

  onRowEditDeleteC(tableC: any, index: number){

  }

  onRowEditInitP(tableP: any) {
    this.clonedTableP[tableP.id as string] = { ...tableP };
  }

  onRowEditSaveP(tableP: any) {

  }

  onRowEditCancelP(tableP: any, index: number) {
    this.preguntasTable[index] = this.clonedTableP[tableP.id as string];
    delete this.clonedTableP[tableP.id as string];
  }

  onRowEditDeleteP(tableC: any, index: number){

  }
}

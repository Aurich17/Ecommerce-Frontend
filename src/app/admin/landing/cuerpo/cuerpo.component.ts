import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cuerpo',
  standalone: true,
  imports: [CardModule, CommonModule, ReactiveFormsModule, TableModule],
  templateUrl: './cuerpo.component.html',
  styleUrl: './cuerpo.component.css'
})
export class CuerpoComponent {
  caracteristicasTable: any[] = [];
  preguntasTable: any[] = [];
}

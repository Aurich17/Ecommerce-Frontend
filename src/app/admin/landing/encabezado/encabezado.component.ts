import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [AccordionModule,CommonModule,ReactiveFormsModule,InputTextModule,ButtonModule],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent {

  encabezadoform = new FormGroup({
    titulo: new FormControl(null),
    subtitulo: new FormControl(null),
    parafrasis: new FormControl(null),
    tituloMP: new FormControl(null),
    subtituloMP: new FormControl(null),
    nota: new FormControl(null)
  });

  guardarCambios(){
    
  }
}

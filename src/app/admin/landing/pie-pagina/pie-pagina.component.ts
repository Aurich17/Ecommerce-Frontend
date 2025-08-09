import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pie-pagina',
  standalone: true,
  imports: [AccordionModule, CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './pie-pagina.component.html',
  styleUrl: './pie-pagina.component.css'
})
export class PiePaginaComponent {
  piepaginaform = new FormGroup({
    correo: new FormControl(null),
    telefono: new FormControl(null),
    titulo: new FormControl(null),
    descripcion: new FormControl(null),
    descripcionizq: new FormControl(null),
    copyright: new FormControl(null)
  });

  guardarCambios() {
  }
}

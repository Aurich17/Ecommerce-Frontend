import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-permisosrol',
  standalone: true,
  imports: [AccordionModule, ReactiveFormsModule, ButtonModule, TableModule, CheckboxModule, FormsModule],
  templateUrl: './permisosrol.component.html',
  styleUrl: './permisosrol.component.css'
})
export class PermisosrolComponent {
  descripcionrol: string = ''
  migracionTable: any[] = [{ id: '1', nombre: 'Periodo', acceso: true, ver: true, agregar: false, editar: true, eliminar: false },
  { id: '2', nombre: 'Estudiante', acceso: true, ver: true, agregar: false, editar: true, eliminar: false }
  ]
  mantTable: any[] = []

  seleccionarPermiso(event: CheckboxChangeEvent, product: any, campo: string) {
    console.log('event', event)
    console.log('product', product)
    product[campo] = event.checked;
    console.log('lista', this.migracionTable)
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { StepsModule } from 'primeng/steps';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StepsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    FileUploadModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {
    // Step indicator
  items: MenuItem[] = [
    { label: 'Información personal' },
    { label: 'Documentos' },
    { label: 'Credenciales' },
    { label: 'Confirmación' }
  ];
  activeIndex: number = 0;

  // Form groups
  personalForm = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    direccion: new FormControl(''),
    fechaNacimiento: new FormControl(null),
    pais: new FormControl(null),
    provincia: new FormControl(null),
    ciudad: new FormControl(null),
    ocupacion: new FormControl(null),
    genero: new FormControl(null)
  });

  docsForm = new FormGroup({
    selfie: new FormControl(null, Validators.required),
    dniReverso: new FormControl(null, Validators.required)
  });

  credentialsForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    contactoNombre: new FormControl(''),
    contactoTelefono: new FormControl('')
  });

  // Options (deben cargarse dinámicamente)
  paises: any[] = [{ label: 'Seleccione un país', value: null }];
  provincias: any[] = [{ label: 'Seleccione una provincia', value: null }];
  ciudades: any[] = [{ label: 'Seleccione un municipio', value: null }];
  ocupaciones: any[] = [{ label: 'Seleccione una ocupación', value: null }];
  generos: any[] = [{ label: 'Seleccione su género', value: null }];

  constructor(private router: Router) {}

  next() {
    if (this.activeIndex === 0 && this.personalForm.invalid) return;
    if (this.activeIndex === 1 && this.docsForm.invalid) return;
    if (this.activeIndex === 2 && this.credentialsForm.invalid) return;
    this.activeIndex++;
  }

  prev() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
  }

  finish() {
    // Aquí enviarías todos los datos al backend
    this.router.navigate(['/register/cliente/success'], {
      state: {
        ...this.personalForm.value,
        ...this.docsForm.value,
        ...this.credentialsForm.value
      }
    });
  }

  // register-cliente.component.ts
onSelfieSelect(event: any) {
  this.docsForm.get('selfie')!.setValue(event.files[0]);
}

onDniReversoSelect(event: any) {
  this.docsForm.get('dniReverso')!.setValue(event.files[0]);
}
}

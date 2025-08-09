import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
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
import { ciudadesResponse, paisesResponse, provinciasResponse, tiposResponse } from '../domain/response/register.response';
import { ApiService } from '../../../../services/api.services';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import intlTelInput from 'intl-tel-input';
type IntlTelOptions = NonNullable<Parameters<typeof intlTelInput>[1]>;


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
    ButtonModule,
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent implements AfterViewInit, OnDestroy{
  @ViewChild('phoneInput', { static: true }) phoneInput!: ElementRef<HTMLInputElement>;
  private iti: any;

  // Options (deben cargarse dinámicamente)
  listPaises:paisesResponse[] = []
  listProvincias: provinciasResponse[] = [];
  listCiudades: ciudadesResponse[] = [];
  filteredCiudades: ciudadesResponse[] = [];
  filteredProvincias: provinciasResponse[] = [];
  listOcupaciones: tiposResponse[] = [];
  listGeneros: tiposResponse[] = [];
  // Step indicator
  items: MenuItem[] = [
    { label: 'Información personal' },
    { label: 'Documentos' },
    { label: 'Credenciales' },
    { label: 'Confirmación' }
  ];
  activeIndex: number = 0;
  //FORMULARIOS==========================================================================================
   // Form groups
  personalForm = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    telefono: new FormControl('', null),
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
  // Constructor======================================================================================
  constructor(private apiService: ApiService, private router: Router){}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  //NgOnInit==========================================================================================
  ngOnInit() {
    this.getPaises();
    this.getProvincias();
    this.getOcupaciones();
    this.getGeneros();
    // this.getCiudades();
    // Escuchar cambios del país seleccionado
    this.personalForm.get('pais')?.valueChanges.subscribe(paisId => {
      if (paisId) {
        this.filteredProvincias = this.listProvincias.filter(
          prov => prov.paisId === paisId
        );
        // Limpiar provincia seleccionada si ya no coincide
        this.personalForm.patchValue({ provincia: null, ciudad: null });
      } else {
        this.filteredProvincias = [];
        this.personalForm.patchValue({ provincia: null, ciudad: null });
      }
    });

      // Provincia → Ciudades (llamando a la API)
  this.personalForm.get('provincia')?.valueChanges.subscribe((provinciaId: number | null) => {
    this.personalForm.patchValue({ ciudad: null }, { emitEvent: false });
    this.filteredCiudades = [];

    if (provinciaId == null) return;

    // Lean (rápido y suficiente para dropdown)
    this.apiService.getCiudades(provinciaId).subscribe({
      next: (rows) => {
        console.log(rows);
        this.filteredCiudades = rows;
        // (opcional) guarda en cache por provinciaId si re-usarás
        // this.listCiudadesPorProvincia[provinciaId] = rows;
      },
      error: (err) => console.error('Error al obtener ciudades', err),
    });

    // Si alguna vista necesitara la relación:
    // this.apiService.getCiudadesByProvinciaWithProvincia(provinciaId).subscribe(...)
  });
  }

  ngAfterViewInit() {
    const input = this.phoneInput.nativeElement;

    this.iti = intlTelInput(input, {
      initialCountry: 'pe',     // o 'auto' + geoIpLookup si quieres
      nationalMode: false,
      separateDialCode: false,  // prefijo +XX dentro del input (editable)
      allowDropdown: false,     // no abrir menú
      utilsScript: '/assets/intl-tel-input/utils.js',
    } as any);

    const validate = () => {
      const ctrl = this.personalForm.get('telefono')!;
      if (!ctrl) return;
      const hasValue = (input.value || '').trim().length > 0;
      const valid = !hasValue || this.iti.isValidNumber();
      if (!valid) ctrl.setErrors({ phone: true });
      else if (ctrl.hasError('phone')) ctrl.updateValueAndValidity({ onlySelf: true });
    };

    input.addEventListener('input', validate);
    input.addEventListener('countrychange', validate);
    input.addEventListener('blur', validate);
  }






  // any[] = [{ label: 'Seleccione un país', value: null }];

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
    const e164 = this.iti?.getNumber() ?? '';
    const payload = { ...this.personalForm.value, telefono: e164 };
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

 getPaises(){
    this.apiService.getPaises().subscribe(
      (data: paisesResponse[]) => {
        this.listPaises = data
      },
      error => {
        console.error('Error al obtener marcas', error);
      }
    );
  }

  getProvincias(){
    this.apiService.getProvincias().subscribe(
      (data: provinciasResponse[]) => {
        this.listProvincias = data
      },
      error => {
        console.error('Error al obtener marcas', error);
      }
    );
  }

  getCiudades(id_provincia:number){
    this.apiService.getCiudades(id_provincia).subscribe(
      (data: ciudadesResponse[]) => {
        this.listCiudades = data;
      },
      error => {
        console.error('Error al obtener ciudades', error);
      }
    );
  }

  getOcupaciones() {
    this.apiService.getOcupaciones().subscribe(
      (data: tiposResponse[]) => {
        this.listOcupaciones = data;
      },
      error => {
        console.error('Error al obtener ocupaciones', error);
      }
    );
  }

  getGeneros() {
    this.apiService.getGeneros().subscribe(
      (data: tiposResponse[]) => {
        this.listGeneros = data;
      },
      error => {
        console.error('Error al obtener géneros', error);
      }
    );
  }
}

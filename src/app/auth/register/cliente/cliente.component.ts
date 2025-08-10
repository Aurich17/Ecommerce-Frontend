import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { StepsModule } from 'primeng/steps';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ciudadesResponse, paisesResponse, provinciasResponse, tiposResponse } from '../domain/response/register.response';
import { ApiService } from '../../../../services/api.services';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import intlTelInput from 'intl-tel-input';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CardModule } from 'primeng/card';
import { registerClienteRequest } from '../domain/request/register.request';
import { finalize } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { LoginRequest } from '../../login/domain/request/login.request';
import { AuthService } from '../../../../services/auth.services';
import { SessionService } from '../../../../services/session/session.service';


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
    ToastModule,
    PanelModule,
    DividerModule,
    InputIconModule,
    IconFieldModule,
    CardModule,
    DialogModule
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
  providers: [MessageService]
})
export class ClienteComponent implements AfterViewInit {
  @ViewChild('phoneInput', { static: true }) phoneInput!: ElementRef<HTMLInputElement>;
  private iti: any;
  visible: boolean = false;
  private auth = inject(AuthService);
  private session = inject(SessionService);
  // Options (deben cargarse dinámicamente)
  listPaises: paisesResponse[] = []
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
    apellidos: new FormControl(null, Validators.required),
    telefono: new FormControl(null, null),
    direccion: new FormControl(null),
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
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
    contactoNombre: new FormControl(null),
    contactoTelefono: new FormControl(null)
  });

  socialsecurity = new FormGroup({
    socialsecurity: new FormControl('')
  });
  // Constructor======================================================================================
  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService) { }
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
    if (this.activeIndex === 0 && this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: 'Campos Obligatorios', detail: 'Falta llenar campos.' });
      return;
    }
    if (this.activeIndex === 1 && this.docsForm.invalid) {
      this.docsForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: 'Documentos Obligatorios', detail: 'No se hn adjuntado todos los documentos necesarios.' });
      return;
    }
    if (this.activeIndex === 2 && this.credentialsForm.invalid) {
      this.credentialsForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: 'Credenciales Obligtorias', detail: 'Falta llenar campos.' });
      return;
    }
    this.activeIndex++;
  }

  prev() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
  }

  loading = false;
  social_security: string = '';
  cliente: string = '';

  finish() {
    this.social_security = '';
    this.cliente = '';
    // Aquí enviarías todos los datos al backend
    const personal = this.personalForm.value;
    const docs = this.docsForm.value;
    const credentials = this.credentialsForm.value;

    const payload: registerClienteRequest = <registerClienteRequest>{}
    payload.nombres = personal.nombres || '';
    payload.apellidos = personal.apellidos || '';
    payload.telefono = personal.telefono || '';
    payload.fecha_nac = personal.fechaNacimiento || new Date("1990-01-01");
    payload.direccion = personal.direccion || '';
    payload.pais_id = personal.pais || 0;
    payload.provincia_id = personal.provincia || 0;
    payload.ciudad_id = personal.ciudad || 0;
    payload.ocupacion_id = personal.ocupacion || 0;
    payload.genero_id = personal.genero || 0;
    payload.selfie_url = '12345';
    payload.dni_url = '12345';
    payload.email = credentials.email || '';
    payload.password = credentials.password || '';
    payload.alt_nombre = credentials.contactoNombre || '';
    payload.alt_telefono = credentials.contactoTelefono || '';

    this.loading = true;

    this.apiService.registerClient(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          if (res.social_security) {
            // ✅ Toast éxito
            this.messageService.add({
              severity: 'success',
              summary: 'Guardado',
              detail: 'El encabezado se actualizó correctamente.',
              life: 2500,
            });

            // const e164 = this.iti?.getNumber() ?? '';
            this.visible = true;
            this.social_security = res.social_security || '';
            this.cliente = `${this.personalForm.value.nombres} ${this.personalForm.value.apellidos}` || ''

            this.socialsecurity.get('socialsecurity')?.setValue(this.social_security);
          }
        },
        error: (err) => {
          console.error('Error al actualizar encabezado:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo registrar cliente.${err?.error?.message || ''}`,
            life: 3500,
          });
        },
      });
  }

  // register-cliente.component.ts
  onSelfieSelect(event: any) {
    this.docsForm.get('selfie')!.setValue(event.files[0]);
  }

  onDniReversoSelect(event: any) {
    this.docsForm.get('dniReverso')!.setValue(event.files[0]);
  }

  getPaises() {
    this.apiService.getPaises().subscribe(
      (data: paisesResponse[]) => {
        this.listPaises = data
      },
      error => {
        console.error('Error al obtener marcas', error);
      }
    );
  }

  getProvincias() {
    this.apiService.getProvincias().subscribe(
      (data: provinciasResponse[]) => {
        this.listProvincias = data
      },
      error => {
        console.error('Error al obtener marcas', error);
      }
    );
  }

  getCiudades(id_provincia: number) {
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
  copy() {
    const value = this.socialsecurity.get('socialsecurity')?.value || '';
    if (value) {
      navigator.clipboard.writeText(value).then(() => {
        console.log('Copiado:', value);
      }).catch(err => {
        console.error('Error al copiar:', err);
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: 'Se ha copiado al portapapeles.',
        life: 2500,
      });
    }
  }
  errorMsg: string = '';
  login() {

    this.loading = true;
    this.errorMsg = '';

    const request: LoginRequest = <LoginRequest>{}
    request.email = this.credentialsForm.value.email || '';
    request.password = this.credentialsForm.value.password || '';

    this.auth.login(request)
      .pipe(
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (res) => {
          console.log('Login OK', res);
          this.session.setFromLogin(res);
          this.router.navigate(["/principal"]);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err?.error?.message
            || (err.status === 0 ? 'No se pudo conectar con el servidor' : 'Credenciales inválidas');
        }
      });
  }
}

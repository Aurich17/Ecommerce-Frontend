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
import { RegisterClienteRequest } from '../domain/request/register.request';
import { finalize } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { LoginRequest } from '../../login/domain/request/login.request';
import { AuthService } from '../../../../services/auth.services';
import { SessionService } from '../../../../services/session/session.service';
import { ImagekitClient } from '../../../../services/imagekit.service';


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



  //RELLENA CATALOGOS
  // crea estos diccionarios una sola vez cuando cargas catálogos
  private mapPAI: Record<number, string> = {}; // { 15: '001', ... }
  private mapREG: Record<number, string> = {};
  private mapMUN: Record<number, string> = {};
  private mapOCU: Record<number, string> = {};
  private mapGEN: Record<number, string> = {};
  private tipoCod = (tab: 'PAI'|'REG'|'MUN'|'OCU'|'GEN', id?: number) => {
    const map = tab==='PAI'?this.mapPAI:tab==='REG'?this.mapREG:tab==='MUN'?this.mapMUN:tab==='OCU'?this.mapOCU:this.mapGEN;
    return id != null ? map[id] : undefined;
  };
  private toDateOnly = (d: Date | string) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0,10);

  private ik = inject(ImagekitClient);
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

  //IMAGENES DE VALIDACION
  selfieFile?: File;
  dniFile?: File;
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
      console.log(this.docsForm)
      this.docsForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: 'Documentos Obligatorios', detail: 'No se han adjuntado todos los documentos necesarios.' });
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



  //PARA REGISTRAR ISMA



  loading = false;
  social_security: string = '';
  cliente: string = '';

  async finish() {
    this.loading = true;
    try {
      const [selfieUrl, dniUrl] = await Promise.all([
        this.selfieFile ? this.uploadToIK(this.selfieFile) : Promise.resolve(''),
        this.dniFile ? this.uploadToIK(this.dniFile) : Promise.resolve(''),
      ]);

      const personal = this.personalForm.value;
      const credentials = this.credentialsForm.value;

      // 👇 cambios mínimos: *_cod, fecha string y dni_reverso_url
      const payload = {
        nombres: personal.nombres || '',
        apellidos: personal.apellidos || '',
        telefono: personal.telefono || '',
        fecha_nac: this.toDateOnly(personal.fechaNacimiento || '1990-01-01'),
        direccion: personal.direccion || '',

        pais_cod:      this.tipoCod('PAI', personal?.pais ?? undefined) ?? '001',
        provincia_cod: this.tipoCod('REG', personal?.provincia ?? undefined) ?? '001',
        ciudad_cod:    this.tipoCod('MUN', personal?.ciudad ?? undefined) ?? '001',
        ocupacion_cod: this.tipoCod('OCU', personal?.ocupacion ?? undefined) ?? '001',
        genero_cod:    this.tipoCod('GEN', personal?.genero ?? undefined) ?? '001',

        selfie_url: selfieUrl,
        dni_reverso_url: dniUrl,          // ⬅️ renombrado para la API

        email: credentials.email || '',
        password: credentials.password || '',

        alt_nombre: credentials.contactoNombre || '',
        alt_telefono: credentials.contactoTelefono || '',
      } as const;

      this.apiService.registerClient(payload)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (res) => {
            if (res.social_security) {
              this.messageService.add({ severity:'success', summary:'Guardado', detail:'Cliente registrado.', life:2500 });
              this.visible = true;
              this.social_security = res.social_security;
              this.cliente = `${personal.nombres} ${personal.apellidos}`.trim();
              this.socialsecurity.get('socialsecurity')?.setValue(this.social_security);
            }
          },
          error: (err) => {
            console.error('Error al registrar cliente:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `No se pudo registrar cliente. ${err?.error?.message || ''}`,
              life: 3500,
            });
          },
        });

    } catch (err: any) {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `No se pudo subir imágenes: ${err?.message || ''}`,
        life: 3500,
      });
    }
  }


  // register-cliente.component.ts
  onSelfieSelect(e: any) {
    const file = e.files?.[0];
    if (!file) return;
    this.selfieFile = file;

    // marca el control como con valor para que pase Validators.required
    this.docsForm.get('selfie')?.setValue(file);
    this.docsForm.get('selfie')?.markAsDirty();
    this.docsForm.get('selfie')?.updateValueAndValidity();
  }

  onDniReversoSelect(e: any) {
    const file = e.files?.[0];
    if (!file) return;
    this.dniFile = file;

    this.docsForm.get('dniReverso')?.setValue(file);
    this.docsForm.get('dniReverso')?.markAsDirty();
    this.docsForm.get('dniReverso')?.updateValueAndValidity();
  }

  private async uploadToIK(file: File): Promise<string> {
    const res: any = await this.ik.uploadAndSave(file, '/clientes', ['registro']);
    // URL optimizada
    return this.ik.url({ path: res.filePath }, { w: 1000, q: 80, f: 'auto' });
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
}

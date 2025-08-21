import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { StepsModule } from 'primeng/steps';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ApiService } from '../../../../services/api.services';
import intlTelInput from 'intl-tel-input';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CardModule } from 'primeng/card';
import { finalize, distinctUntilChanged } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../../../services/auth.services';
import { SessionService } from '../../../../services/session/session.service';
import { ImagekitClient } from '../../../../services/imagekit.service';
import { Tipo } from '../../../tipos/reponse/tipos.response'; // { id:number; nombre:string; codigo?:string; parentId?:number }
import { ComentariosComponent } from '../../../admin/landing/comentarios/comentarios.component';

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
    DialogModule,
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers: [MessageService],
})
export class ClienteComponent implements OnInit, AfterViewInit {
  private toDateOnly = (d: Date | string) =>
    (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

  // ==== INYECCIONES ====
  private ik = inject(ImagekitClient);
  private auth = inject(AuthService);
  private session = inject(SessionService);

  constructor(
    private api: ApiService, // único servicio para /tipos y registro
    private router: Router,
    private messageService: MessageService
  ) {}

  // ==== PHONE INPUT ====
  @ViewChild('phoneInput', { static: true })
  phoneInput!: ElementRef<HTMLInputElement>;
  private iti: any;

  // ==== UI ====
  visible = false;
  items: MenuItem[] = [
    { label: 'Información personal' },
    { label: 'Documentos' },
    { label: 'Credenciales' },
    { label: 'Confirmación' },
  ];
  activeIndex = 0;

  // ==== LISTAS ====
  listPaises: Tipo[] = [];
  listProvincias: Tipo[] = [];
  listMunicipios: Tipo[] = [];
  listOcupaciones: Tipo[] = [];
  listGeneros: Tipo[] = [];

  // ==== LOADING FLAGS ====
  loadingPais = false;
  loadingProv = false;
  loadingMun = false;

  // ==== FORMULARIOS ====
  personalForm = new FormGroup({
    nombres: new FormControl<string | null>('', Validators.required),
    apellidos: new FormControl<string | null>(null, Validators.required),
    telefono: new FormControl<string | null>(null),
    direccion: new FormControl<string | null>(null),
    fechaNacimiento: new FormControl<Date | null>(null),
    pais: new FormControl<number | null>(null),
    provincia: new FormControl<number | null>(null),
    ciudad: new FormControl<number | null>(null),
    ocupacion: new FormControl<number | null>(null),
    genero: new FormControl<number | null>(null),
  });

  docsForm = new FormGroup({
    selfie: new FormControl<File | null>(null, Validators.required),
    dniReverso: new FormControl<File | null>(null, Validators.required),
  });

  credentialsForm = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, Validators.required),
    contactoNombre: new FormControl<string | null>(null),
    contactoTelefono: new FormControl<string | null>(null),
  });

  socialsecurity = new FormGroup({
    socialsecurity: new FormControl<string | null>(''),
  });

  // ==== ARCHIVOS ====
  selfieFile?: File;
  dniFile?: File;

  // ==== ESTADO REGISTRO ====
  loading = false;
  social_security = '';
  cliente = '';

  // ================= LIFECYCLE =================
  ngOnInit(): void {
    // Cargar catálogos base
    this.cargarPaises();
    // this.cargarOcupaciones();
    // this.cargarGeneros();

    // Cascada País -> Provincia
    this.personalForm
      .get('pais')!
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((paisId) => {
        this.personalForm.patchValue(
          { provincia: null, ciudad: null },
          { emitEvent: false }
        );
        this.listMunicipios = [];
        // if (paisId) this.cargarProvincias(paisId);
        // else this.listProvincias = [];
      });

    // Cascada Provincia -> Municipio
    this.personalForm
      .get('provincia')!
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((provinciaId) => {
        this.personalForm.patchValue({ ciudad: null }, { emitEvent: false });
        // if (provinciaId) this.cargarMunicipios(provinciaId);
        // else this.listMunicipios = [];
      });
  }

  ngAfterViewInit(): void {
    const input = this.phoneInput.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: 'pe',
      nationalMode: false,
      separateDialCode: false,
      allowDropdown: false,
      utilsScript: '/assets/intl-tel-input/utils.js',
    } as IntlTelOptions);

    const validate = () => {
      const ctrl = this.personalForm.get('telefono')!;
      const hasValue = (input.value || '').trim().length > 0;
      const valid = !hasValue || this.iti.isValidNumber();
      if (!valid) ctrl.setErrors({ phone: true });
      else if (ctrl.hasError('phone'))
        ctrl.updateValueAndValidity({ onlySelf: true });
    };

    input.addEventListener('input', validate);
    input.addEventListener('countrychange', validate);
    input.addEventListener('blur', validate);
  }

  // ================= NAVEGACION STEPS =================
  next(): void {
    if (this.activeIndex === 0 && this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obligatorios',
        detail: 'Falta llenar campos.',
      });
      return;
    }
    if (this.activeIndex === 1 && this.docsForm.invalid) {
      this.docsForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        summary: 'Documentos Obligatorios',
        detail: 'No se han adjuntado todos los documentos necesarios.',
      });
      return;
    }
    if (this.activeIndex === 2 && this.credentialsForm.invalid) {
      this.credentialsForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        summary: 'Credenciales Obligtorias',
        detail: 'Falta llenar campos.',
      });
      return;
    }
    this.activeIndex++;
  }

  prev(): void {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
  }

  // ================= HANDLERS FILES =================
  onSelfieSelect(e: any): void {
    const file = e.files?.[0];
    if (!file) return;
    this.selfieFile = file;
    this.docsForm.get('selfie')?.setValue(file);
    this.docsForm.get('selfie')?.markAsDirty();
    this.docsForm.get('selfie')?.updateValueAndValidity();
  }

  onDniReversoSelect(e: any): void {
    const file = e.files?.[0];
    if (!file) return;
    this.dniFile = file;
    this.docsForm.get('dniReverso')?.setValue(file);
    this.docsForm.get('dniReverso')?.markAsDirty();
    this.docsForm.get('dniReverso')?.updateValueAndValidity();
  }

  // ================= CARGA CATALOGOS (via /tipos) =================
  private cargarPaises(): void {
    this.loadingPais = true;
    this.api
      .obtenerTipos('PAI')
      .pipe(finalize(() => (this.loadingPais = false)))
      .subscribe({
        next: (data) => (this.listPaises = data),
        error: () => (this.listPaises = []),
      });
  }

  // private cargarProvincias(paisId: number): void {
  //   this.loadingProv = true;
  //   const req: { tab: 'PROVINCIA'; parentId: number } = {
  //     tab: 'PROVINCIA',
  //     parentId: paisId,
  //   };
  //   this.api
  //     .obtenerTipos(req)
  //     .pipe(finalize(() => (this.loadingProv = false)))
  //     .subscribe({
  //       next: (data) => {
  //         this.listProvincias = data;
  //       },
  //       error: () => (this.listProvincias = []),
  //     });
  // }

  // private cargarMunicipios(provinciaId: number): void {
  //   this.loadingMun = true;
  //   const req: { tab: 'MUNICIPIO'; parentId: number } = {
  //     tab: 'MUNICIPIO',
  //     parentId: provinciaId,
  //   };
  //   this.api
  //     .obtenerTipos(req)
  //     .pipe(finalize(() => (this.loadingMun = false)))
  //     .subscribe({
  //       next: (data) => {
  //         this.listMunicipios = data;
  //       },
  //       error: () => (this.listMunicipios = []),
  //     });
  // }

  // private cargarOcupaciones(): void {
  //   this.api.obtenerTipos({ tab: 'OCU' }).subscribe({
  //     next: (data: Tipo[]) => {
  //       this.listOcupaciones = data;
  //     },
  //     error: () => (this.listOcupaciones = []),
  //   });
  // }

  // private cargarGeneros(): void {
  //   this.api.obtenerTipos({ tab: 'GEN' }).subscribe({
  //     next: (data: Tipo[]) => {
  //       this.listGeneros = data;
  //     },
  //     error: () => (this.listGeneros = []),
  //   });
  // }

  // ================= REGISTRO =================
  async finish(): Promise<void> {
    this.loading = true;
    try {
      const [selfieUrl, dniUrl] = await Promise.all([
        this.selfieFile
          ? this.uploadToIK(this.selfieFile)
          : Promise.resolve(''),
        this.dniFile ? this.uploadToIK(this.dniFile) : Promise.resolve(''),
      ]);

      const personal = this.personalForm.value;
      const credentials = this.credentialsForm.value;

      const payload = {
        nombres: personal.nombres || '',
        apellidos: personal.apellidos || '',
        telefono: personal.telefono || '',
        fecha_nac: this.toDateOnly(personal.fechaNacimiento || '1990-01-01'),
        direccion: personal.direccion || '',

        pais_cod: String(this.personalForm.value.pais ?? ''),
        provincia_cod: String(this.personalForm.value.provincia ?? ''),
        ciudad_cod: String(this.personalForm.value.ciudad ?? ''),
        ocupacion_cod: String(this.personalForm.value.ocupacion ?? ''),
        genero_cod: String(this.personalForm.value.genero ?? ''),

        selfie_url: selfieUrl,
        dni_reverso_url: dniUrl,

        email: credentials.email || '',
        password: credentials.password || '',

        alt_nombre: credentials.contactoNombre || '',
        alt_telefono: credentials.contactoTelefono || '',
      } as const;

      this.api
        .registerClient(payload)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (res: any) => {
            if (res.social_security) {
              this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: 'Cliente registrado.',
                life: 2500,
              });
              this.visible = true;
              this.social_security = res.social_security;
              this.cliente = `${personal.nombres || ''} ${
                personal.apellidos || ''
              }`.trim();
              this.socialsecurity
                .get('socialsecurity')
                ?.setValue(this.social_security);
            }
          },
          error: (err) => {
            console.error('Error al registrar cliente:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `No se pudo registrar cliente. ${
                err?.error?.message || ''
              }`,
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

  private async uploadToIK(file: File): Promise<string> {
    const res: any = await this.ik.uploadAndSave(file, '/clientes', [
      'registro',
    ]);
    return this.ik.url({ path: res.filePath }, { w: 1000, q: 80, f: 'auto' });
  }

  copy(): void {
    const value = this.socialsecurity.get('socialsecurity')?.value || '';
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() =>
        this.messageService.add({
          severity: 'success',
          summary: 'Copiado',
          detail: 'Se ha copiado al portapapeles.',
          life: 2500,
        })
      )
      .catch(() =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo copiar.',
          life: 2500,
        })
      );
  }

  errorMsg = '';
}

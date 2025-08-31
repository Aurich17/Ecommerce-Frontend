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
// import intlTelInput from 'intl-tel-input';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CardModule } from 'primeng/card';
import { finalize } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../../../services/auth.services';
import { SessionService } from '../../../../services/session/session.service';
import { ImagekitClient } from '../../../../services/imagekit.service';
import { MailService } from '../../../../services/mail/mail.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Tipo normalizado para usar SIEMPRE desc/cod
interface TipoUI {
  id?: number | string;
  desc: string;
  cod: string;
  parent?: string;
}

// type IntlTelOptions = NonNullable<Parameters<typeof intlTelInput>[1]>;

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
  logoUrl: string | null = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private messageService: MessageService,
    private mailService: MailService
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

  // ==== LISTAS (todas normalizadas a desc/cod) ====
  listPaises: TipoUI[] = [];
  listOcupaciones: TipoUI[] = [];
  listGeneros: TipoUI[] = [];

  allProvincias: TipoUI[] = []; // REG
  allMunicipios: TipoUI[] = []; // MUN

  filteredProvincias: TipoUI[] = [];
  filteredMunicipios: TipoUI[] = [];

  // ==== LOADING FLAGS ====
  loadingPais = false;
  loadingProv = false;
  loadingMun = false;

  //MOMENTANEO---------------------------------------
  // países
  PAISES = [
    { cod: '001', desc: 'Perú' },
    { cod: '002', desc: 'México' },
  ];

  // provincias / estados (campo parent = país.cod)
  PROVINCIAS = [
    { cod: '001', desc: 'Lima', parent: '001' }, // pertenece a Perú
    { cod: '002', desc: 'Cusco', parent: '001' }, // pertenece a Perú
    { cod: '003', desc: 'Jalisco', parent: '002' }, // pertenece a México
    { cod: '004', desc: 'CDMX', parent: '002' }, // pertenece a México
  ];

  // municipios / ciudades (campo parent = provincia.cod)
  MUNICIPIOS = [
    { cod: '001', desc: 'Miraflores', parent: '001' }, // Lima
    { cod: '002', desc: 'San Isidro', parent: '001' }, // Lima
    { cod: '003', desc: 'Pisac', parent: '002' }, // Cusco
    { cod: '004', desc: 'Guadalajara', parent: '003' }, // Jalisco
    { cod: '005', desc: 'Zapopan', parent: '003' }, // Jalisco
    { cod: '006', desc: 'Coyoacán', parent: '004' }, // CDMX
  ];

  // ==== FORMULARIOS ====
  // OJO: pais/provincia/ciudad ahora son string (guardan 'cod')
  //      ocupacion/genero también, para optionValue="cod"
  personalForm = new FormGroup({
    nombres: new FormControl<string | null>('', Validators.required),
    apellidos: new FormControl<string | null>(null, Validators.required),
    telefono: new FormControl<string | null>(null),
    direccion: new FormControl<string | null>(null),
    fechaNacimiento: new FormControl<Date | null>(null),

    pais: new FormControl<string | null>(null),
    provincia: new FormControl<string | null>(null),
    ciudad: new FormControl<string | null>(null),

    ocupacion: new FormControl<string | null>(null),
    genero: new FormControl<string | null>(null),
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
    this.logoUrl = localStorage.getItem('logoUrl');
    this.cargarOcupaciones();
    this.cargarGeneros();
    this.listPaises = this.PAISES;
    this.allProvincias = this.PROVINCIAS;
    this.allMunicipios = this.MUNICIPIOS;

    // === listeners ===
    this.personalForm.get('pais')!.valueChanges.subscribe((paisCod) => {
      this.personalForm.patchValue(
        { provincia: null, ciudad: null },
        { emitEvent: false }
      );
      this.filteredMunicipios = [];

      this.filteredProvincias = paisCod
        ? this.allProvincias.filter((p) => p.parent === paisCod)
        : [];
    });

    this.personalForm.get('provincia')!.valueChanges.subscribe((provCod) => {
      this.personalForm.patchValue({ ciudad: null }, { emitEvent: false });

      this.filteredMunicipios = provCod
        ? this.allMunicipios.filter((m) => m.parent === provCod)
        : [];
    });
  }

  ngAfterViewInit(): void {
    const input = this.phoneInput.nativeElement;
    // this.iti = intlTelInput(input, {
    //   initialCountry: 'pe',
    //   nationalMode: false,
    //   separateDialCode: false,
    //   allowDropdown: false,
    //   utilsScript: '/assets/intl-tel-input/utils.js',
    // } as IntlTelOptions);

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

  // ================= HELPERS =================
  // Normaliza cualquier respuesta del backend a {desc, cod}
  private normalize(list: any[]): TipoUI[] {
    return (list ?? []).map((x) => ({
      id: x.id ?? x.ID ?? x.cod ?? x.codigo ?? x.cod_tipo,
      desc: x.desc ?? x.des_tipo ?? x.nombre ?? x.descripcion ?? '',
      cod: x.cod ?? x.codigo ?? x.cod_tipo ?? '',
      parent: x.parent ?? x.parent_id ?? x.parentCod ?? undefined, // <- añade esto
    }));
  }

  // ================= CARGA CATALOGOS =================
  private cargarPaises(): void {
    this.loadingPais = true;
    this.api
      .obtenerTipos('PAI')
      .pipe(finalize(() => (this.loadingPais = false)))
      .subscribe({
        next: (data: any[]) => (this.listPaises = this.normalize(data)),
        error: () => (this.listPaises = []),
      });
  }

  // En tu DB es REG (estados/provincias)
  private cargarProvincias(): void {
    this.loadingProv = true;
    this.api
      .obtenerTipos('REG')
      .pipe(finalize(() => (this.loadingProv = false)))
      .subscribe({
        next: (data: any[]) => {
          this.allProvincias = this.normalize(data);
          // Recalcular si ya hay país seleccionado
          const paisCod = this.personalForm.value.pais;
          if (paisCod) {
            this.filteredProvincias = this.allProvincias.filter((p) =>
              (p.cod ?? '').startsWith(paisCod + '-')
            );
            const provCtrl = this.personalForm.get('provincia')!;
            this.filteredProvincias.length > 0
              ? provCtrl.enable({ emitEvent: false })
              : provCtrl.disable({ emitEvent: false });
          }
        },
        error: () => (this.allProvincias = []),
      });
  }

  private cargarMunicipios(): void {
    this.loadingMun = true;
    this.api
      .obtenerTipos('MUN')
      .pipe(finalize(() => (this.loadingMun = false)))
      .subscribe({
        next: (data: any[]) => {
          this.allMunicipios = this.normalize(data);
          // Recalcular si ya hay provincia seleccionada
          const provCod = this.personalForm.value.provincia;
          if (provCod) {
            this.filteredMunicipios = this.allMunicipios.filter((m) =>
              (m.cod ?? '').startsWith(provCod + '-')
            );
            const ciudadCtrl = this.personalForm.get('ciudad')!;
            this.filteredMunicipios.length > 0
              ? ciudadCtrl.enable({ emitEvent: false })
              : ciudadCtrl.disable({ emitEvent: false });
          }
        },
        error: () => (this.allMunicipios = []),
      });
  }

  private cargarOcupaciones(): void {
    this.api.obtenerTipos('OCU').subscribe({
      next: (data: any[]) => (this.listOcupaciones = this.normalize(data)),
      error: () => (this.listOcupaciones = []),
    });
  }

  private cargarGeneros(): void {
    this.api.obtenerTipos('GEN').subscribe({
      next: (data: any[]) => (this.listGeneros = this.normalize(data)),
      error: () => (this.listGeneros = []),
    });
  }

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

        // ahora son códigos (PE, PE-LIM, PE-LIM-150122, etc.)
        pais_cod: String(personal.pais ?? ''),
        provincia_cod: String(personal.provincia ?? ''),
        ciudad_cod: String(personal.ciudad ?? ''),
        ocupacion_cod: String(personal.ocupacion ?? ''),
        genero_cod: String(personal.genero ?? ''),

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
              this.enviarCorreo();
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
  enviarCorreo() {
    const values = this.personalForm.value;
    const valuescorreo = this.credentialsForm.value;
    const to = valuescorreo.email || '';
    const subject = 'Cuenta registrada con éxito';
    const text = `
    <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="text-align:center; color:#333;">Cuenta registrada con éxito</h2>
        <p style="font-size:16px; color:#555; text-align:center;">
          Estimado/a <strong>${values.nombres} ${values.apellidos}</strong>,<br><br>
          Su cuenta ha sido registrada exitosamente en nuestra plataforma.
        </p>
        <p style="font-size:16px; color:#555; text-align:center; margin-top:20px;">
          Gracias por confiar en nosotros.
        </p>
        <p style="font-size:14px; color:#888; text-align:center; margin-top:30px;">
          Atentamente,<br>
          El equipo de FiaoX
        </p>
      </div>
    </div>
  `;

    this.mailService.sendMail(to, subject, text).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del backend:', res);
        alert('Correo enviado con éxito');
      },
      error: (err) => {
        console.error('❌ Error al enviar correo:', err);
        alert('Error al enviar correo');
      },
    });
  }

  //telefono
  flagIso: string | null = null;
  private DIAL_MAP: Record<string, string> = {
    '51': 'pe', // Perú
    '52': 'mx', // México
    '34': 'es', // España
    '54': 'ar', // Argentina
    '56': 'cl', // Chile
    '57': 'co', // Colombia

    // === Nuevos 20 ===
    '53': 'cu', // Cuba
    '55': 'br', // Brasil
    '58': 've', // Venezuela
    '502': 'gt', // Guatemala
    '503': 'sv', // El Salvador
    '504': 'hn', // Honduras
    '505': 'ni', // Nicaragua
    '506': 'cr', // Costa Rica
    '507': 'pa', // Panamá
    '509': 'ht', // Haití
    '591': 'bo', // Bolivia
    '592': 'gy', // Guyana
    '593': 'ec', // Ecuador
    '595': 'py', // Paraguay
    '598': 'uy', // Uruguay
    '1': 'us', // Estados Unidos (ojo: también Canadá y Caribe)
    '44': 'gb', // Reino Unido
    '33': 'fr', // Francia
    '49': 'de', // Alemania
    '39': 'it', // Italia
    '351': 'pt', // Portugal
  };

  onPhoneInput(raw: string) {
    const v = (raw || '').trim();
    let iso: string | null = null;

    // 1) intenta parse completo
    try {
      const p = parsePhoneNumberFromString(v);
      if (p?.country) iso = p.country.toLowerCase();
    } catch {}

    // 2) si aún no hay país (ej. "+51"), toma prefijo
    if (!iso) {
      const m = v.match(/^\+(\d{1,3})/);
      if (m) {
        const dial = m[1];
        iso = this.DIAL_MAP[dial] ?? null;
      }
    }

    this.flagIso = iso;
  }
}

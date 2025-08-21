import { Component } from '@angular/core';
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
import { finalize,distinctUntilChanged } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { LoginRequest } from '../../login/domain/request/login.request';
import { AuthService } from '../../../../services/auth.services';
import { SessionService } from '../../../../services/session/session.service';
import { ImagekitClient } from '../../../../services/imagekit.service';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { Tipo } from '../../../tipos/reponse/tipos.response';


@Component({
  selector: 'app-empresa',
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
    InputNumberModule
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css',
  providers: [MessageService]
})
export class EmpresaComponent {
  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService) { }
  visible: boolean = false
  items: MenuItem[] = [
    { label: 'Información Básica' },
    { label: 'Ubicación' },
    { label: 'Representante Legal' },
    { label: 'Credenciales' },
    { label: 'Confirmación' }
  ];
  listaTipoNegocio: any[] = []
  listaCiudad: any[] = []
  listaDepartamento: any[] = []
  listaCargo: any[] = []
  listPaises: Tipo[] = [];
  listProvincias: Tipo[] = [];
  listMunicipios: Tipo[] = [];
  loadingPais = false;
  loadingProv = false;
  loadingMun = false;
  activeIndex: number = 0;
  cliente: string = '';
  basicForm = new FormGroup({
    nombrecompleto: new FormControl<string | null>('', Validators.required),
    tiponegocio: new FormControl<number | null>(null),
    fechafundacion: new FormControl<Date | null>(null),
    numeroempleados: new FormControl<number | null>(null),
    pais: new FormControl<number | null>(null),
    provincia: new FormControl<number | null>(null),
    ciudad: new FormControl<number | null>(null),
  });

  ubicacionForm = new FormGroup({
    direccionfiscal: new FormControl('', null),
    ciudad: new FormControl(null, null),
    departamento: new FormControl(null, null),
    codigopostal: new FormControl(null, null),
    sitioweb: new FormControl(null, null)
  });

  representanteForm = new FormGroup({
    nombrerepresentante: new FormControl('', null),
    cargo: new FormControl(null, null),
    telefono: new FormControl(null, null),
    telefonoalt: new FormControl(null, null),
    correo: new FormControl(null, null)
  });

  credencialesForm = new FormGroup({
    correo: new FormControl('', null),
    contrasenia: new FormControl(null, null)
  });

  socialsecurity = new FormGroup({
    socialsecurity: new FormControl('')
  });

  ngOnInit(): void {
    this.cargarPaises();
    this.basicForm.get('pais')!.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((paisId) => {
        this.basicForm.patchValue({ provincia: null, ciudad: null }, { emitEvent: false });
        if (paisId) this.cargarProvincias(paisId);
        else this.listProvincias = [];
      });

    // Cascada Provincia -> Municipio
    this.basicForm.get('provincia')!.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((provinciaId) => {
        this.basicForm.patchValue({ ciudad: null }, { emitEvent: false });
        if (provinciaId) this.cargarMunicipios(provinciaId);
        else this.listMunicipios = [];
      });
  }

  next() {
    if (this.activeIndex === 0 && this.basicForm.invalid) {
      this.basicForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: 'Campos Obligatorios', detail: 'Falta llenar campos.' });
      return;
    }
    if (this.activeIndex === 1 && this.ubicacionForm.invalid) {
      this.ubicacionForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: 'Campos Obligatorios', detail: 'Falta llenar campos.' });
      return;
    }
    if (this.activeIndex === 2 && this.representanteForm.invalid) {
      this.representanteForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: 'Campos Obligatorios', detail: 'Falta llenar campos.' });
      return;
    }
    if (this.activeIndex === 3 && this.credencialesForm.invalid) {
      this.credencialesForm.markAllAsTouched();
      this.messageService.clear();
      this.messageService.add({ severity: 'warn', summary: 'Campos Obligatorios', detail: 'Falta llenar campos.' });
      return;
    }
    this.activeIndex++;
  }

  prev() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
  }

  async finish() {
    this.visible = true
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

  private cargarPaises(): void {
    this.loadingPais = true;
    this.apiService.obtenerTipos({ tab: 'PAI' })
      .pipe(finalize(() => (this.loadingPais = false)))
      .subscribe({
        next: (data: Tipo[]) => {
          console.log(data)
          this.listPaises = data;
        },
        error: () => (this.listPaises = [])
      });
  }


  private cargarProvincias(paisId: number): void {
    this.loadingProv = true;
    const req: { tab: 'PROVINCIA'; parentId: number } = { tab: 'PROVINCIA', parentId: paisId };
    this.apiService.obtenerTipos(req)
      .pipe(finalize(() => (this.loadingProv = false)))
      .subscribe({
        next: (data) => { this.listProvincias = data; },
        error: () => (this.listProvincias = [])
      });
  }

  private cargarMunicipios(provinciaId: number): void {
    this.loadingMun = true;
    const req: { tab: 'MUNICIPIO'; parentId: number } = { tab: 'MUNICIPIO', parentId: provinciaId };
    this.apiService.obtenerTipos(req)
      .pipe(finalize(() => (this.loadingMun = false)))
      .subscribe({
        next: (data) => { this.listMunicipios = data; },
        error: () => (this.listMunicipios = [])
      });
  }
}

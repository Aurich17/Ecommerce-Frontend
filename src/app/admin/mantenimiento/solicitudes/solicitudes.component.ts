/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { MailService } from '../../../../services/mail/mail.service';
import { BadgeModule } from 'primeng/badge';
import {
  UsersWithDocumentsService,
  UserWithDocuments,
  UsersWithDocumentsFilters,
  UserDocument,
} from '../../../../services/users-with-documents.service';
import { UsersApi } from '../../../../services/users.api';
import { ApiService } from '../../../../services/api.services';

interface DocVM {
  documentType: string;
  imageUrl: string;
  fileName: string;
}

interface TipoUI {
  id?: number | string;
  desc: string;
  cod: string;
  parent?: string;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [
    InputTextareaModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    FormsModule,
    TagModule,
    DialogModule,
    SelectButtonModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    BadgeModule,
  ],
  providers: [MessageService], // Agregar esta línea
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
})
export class SolicitudesComponent implements OnInit {
  private roleFilterLocal: 'todos' | 'clientes' | 'empresas' = 'todos';
  private ROLE_MAP: Record<string, number | undefined> = {
    todos: undefined,
    empresas: 2, // <-- reemplaza por tu ID real
    clientes: 3, // <-- reemplaza por tu ID real
  };
  onRoleSelect(val: 'todos' | 'clientes' | 'empresas') {
    this.roleFilterLocal = val;
    this.searchFilters.roleId = this.ROLE_MAP[val]; // <- usa el mapa
    this.searchFilters.page = 1;
    this.currentPage = 1;
    this.loadUsersWithDocuments();
  }
  // Propiedades de UI
  visible: boolean = false;
  infocliente: boolean = false;
  loading: boolean = false;
  labelbtn: string = 'Actualizar';
  fotovalidacion: any;
  fotodocumento: any;

  // Propiedades para la nueva funcionalidad
  usersWithDocuments: UserWithDocuments[] = [];
  totalUsers = 0;
  currentPage = 1;
  pageSize = 10;
  selectedUser: UserWithDocuments | null = null;
  userDocuments: DocVM[] = [];
  listEstado: TipoUI[] = [];
  documentViewVisible = false;
  selectedDocumentUrl = '';

  // Filtros para la búsqueda
  searchFilters: UsersWithDocumentsFilters = {
    page: 1,
    limit: 10,
  };

  // Datos de ejemplo (mantener para compatibilidad)

  // Formularios
  solicitudesform = new FormGroup({
    selectfiltro: new FormControl('todos', null),
    nombreapellido: new FormControl(null, null),
  });

  poppupgroup = new FormGroup({
    select: new FormControl<'documentos' | 'infousser'>('documentos'),
    nombre: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    rol: new FormControl<string | null>(null),
    socialsecurity: new FormControl<string | null>(null),
    estado: new FormControl<string | null>(null),
    motivorechazo: new FormControl<string | null>(null),
  });

  // Opciones para dropdowns
  stateOptions: any[] = [
    { label: 'Documentos', value: 'documentos' },
    { label: 'Info de Usuario', value: 'infousser' },
  ];

  optionsFiltro: any[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Clientes', value: 'clientes' },
    { label: 'Empresas', value: 'empresas' },
  ];

  constructor(
    private mailService: MailService,
    private usersWithDocumentsService: UsersWithDocumentsService,
    private messageService: MessageService,
    private usersApi: UsersApi,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadUsersWithDocuments();
    this.cargarCargos();
  }

  // Métodos de exportación
  exportExcel() {
    // Implementar exportación a Excel
  }

  exportCsv() {
    // Implementar exportación a CSV
  }

  exportPdf() {
    // Implementar exportación a PDF
  }

  // Método para eliminar fila
  onDeleteRow(id: number) {
    // Implementar eliminación
  }

  // Método para mostrar sección en el modal
  mostrarSeccion(event: SelectButtonChangeEvent) {
    console.log('event', event);
    if (event?.value === 'documentos') {
      this.infocliente = false;
    } else {
      this.infocliente = true;
    }
  }

  // Método para cargar usuarios con documentos
  loadUsersWithDocuments(): void {
    this.loading = true;

    const base = {
      page: this.currentPage,
      limit: this.pageSize,
      q: this.searchFilters.q?.trim() || undefined,
      estCod: this.searchFilters.estCod ?? '001',
      // si quieres pasar roleId cuando el usuario elija el filtro:
      roleId: this.ROLE_MAP[this.roleFilterLocal], // puede quedar undefined para "todos"
    };

    this.usersApi.list(base).subscribe({
      next: (res) => {
        const arr = Array.isArray(res?.data) ? res.data : [];

        // Filtro defensivo por rol en FE
        const filtered = arr.filter((u: any) => {
          const r = String(u.role ?? u.primaryRole ?? '').toLowerCase();
          if (this.roleFilterLocal === 'empresas')
            return r === 'empresa' || u.roleId === 2;
          if (this.roleFilterLocal === 'clientes')
            return r === 'cliente' || u.roleId === 3;
          return (
            r === 'empresa' ||
            r === 'cliente' ||
            u.roleId === 2 ||
            u.roleId === 3
          );
        });

        // DEDUP por id, por si el backend aún mezcla
        const unique = Array.from(
          new Map(filtered.map((u: any) => [u.id, u])).values()
        );

        this.usersWithDocuments = unique.map((u) => this.mapToRow(u));
        this.totalUsers = this.usersWithDocuments.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.usersWithDocuments = [];
        this.totalUsers = 0;
        this.loading = false;
      },
    });
  }

  private loadDocumentsForUser(u: UserWithDocuments) {
    const role = (u.primaryRole || '').toLowerCase(); // 'cliente' | 'empresa'
    const type = role === 'empresa' ? 'empresa' : 'cliente'; // default cliente

    this.usersWithDocumentsService
      .getUserDocuments(String(u.id), type as 'cliente' | 'empresa')
      .subscribe({
        next: (res) => {
          this.userDocuments = res?.data ?? [];
        },
        error: (err) => {
          console.error('Error cargando documentos', err);
          this.userDocuments = [];
        },
      });
  }

  private isClienteOEempresa(u: any): boolean {
    const roleStr = (u.primaryRole ?? u.role ?? u.roleName ?? '')
      .toString()
      .trim()
      .toLowerCase();
    const roleId = Number(u.primaryRoleId ?? u.roleId ?? NaN);

    if (roleStr) return roleStr === 'empresa' || roleStr === 'cliente';
    if (!Number.isNaN(roleId)) return roleId === 2 || roleId === 3;
    return false;
  }

  // Método para filtrar por búsqueda
  onSearch(searchTerm: string): void {
    this.searchFilters.q = searchTerm;
    this.searchFilters.page = 1;
    this.currentPage = 1;
    this.loadUsersWithDocuments();
  }

  // Método para filtrar por estado
  onStatusFilter(estCod: string): void {
    this.searchFilters.estCod = estCod;
    this.searchFilters.page = 1;
    this.currentPage = 1;
    this.loadUsersWithDocuments();
  }

  // Método para filtrar por rol
  onRoleFilter(roleId: number): void {
    this.searchFilters.roleId = roleId;
    this.searchFilters.page = 1;
    this.currentPage = 1;
    this.loadUsersWithDocuments();
  }

  // Método para cambiar página
  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.searchFilters.page = this.currentPage;
    this.loadUsersWithDocuments();
  }

  // Método para abrir el popup de edición (versión unificada)
  onEditPoppup(user: any): void {
    this.visible = true;
    this.loading = true;

    // 1) Lo que viene desde la fila de la tabla
    console.log('%c[EDIT] Row user (input):', 'color:#0af', user);

    this.usersApi.getUserSummary(user.id).subscribe({
      next: (res) => {
        console.log('%c[EDIT] /summary raw response:', 'color:#2a2', res);

        const u = res?.data;
        if (!u) {
          this.loading = false;
          return;
        }

        // 2) Lo que trae el backend ya mapeado
        console.log('%c[EDIT] Parsed summary:', 'color:#2a2', {
          id: u.id,
          name: u.name,
          email: u.email,
          social: u.social,
          status: u.status,
          role: u.role,
          docsCount: Array.isArray(u.documents) ? u.documents.length : 0,
        });
        if (Array.isArray(u.documents)) {
          console.table(u.documents); // type/url por fila
        }

        // 3) Patch al formulario (lo que vas a mostrar)
        this.poppupgroup.patchValue({
          nombre: u.name,
          email: u.email,
          rol: u.role,
          socialsecurity: u.social,
          estado: u.status,
        });
        console.log(
          '%c[EDIT] Form after patchValue:',
          'color:#f90',
          this.poppupgroup.getRawValue()
        );

        // 4) Adaptación de documentos para el template
        this.userDocuments = (u.documents || []).map((d: any) => ({
          documentType: d.type,
          imageUrl: d.url,
          fileName: d.url?.split('/').pop() || d.type,
        }));
        console.table(this.userDocuments);

        // 5) selectedUser que usas para actualizar estado
        this.selectedUser = {
          id: u.id,
          fullName: u.name,
          email: u.email,
          primaryRole: u.role,
          socialSecurity: u.social,
          status: u.status,
          documents: this.userDocuments,
        } as any;
        console.log(
          '%c[EDIT] selectedUser VM:',
          'color:#a0f',
          this.selectedUser
        );

        this.loading = false;
      },
      error: (err) => {
        console.error('[EDIT] /summary error:', err);
        this.userDocuments = [];
        this.loading = false;
      },
    });
  }

  // Método para actualizar cliente (versión unificada)
  actualizarCliente(): void {
    if (!this.selectedUser) return;

    const newStatus = this.poppupgroup.get('estado')?.value;
    if (!newStatus) return;

    this.loading = true;

    this.usersWithDocumentsService
      .updateUserStatus(String(this.selectedUser.id), { status: newStatus })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Estado del usuario actualizado correctamente',
          });
          this.loadUsersWithDocuments();
          this.visible = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating user status:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el estado del usuario',
          });
          this.loading = false;
        },
      });
  }

  // Método para visualizar documento en modal
  viewDocument(imageUrl: string): void {
    this.selectedDocumentUrl = imageUrl;
    this.documentViewVisible = true;
  }

  // Método para obtener la severidad del estado (versión unificada)
  getSeverity(
    status: string
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'aprobado':
      case 'activo':
        return 'success';
      case 'pending':
      case 'pendiente':
        return 'warning';
      case 'rejected':
      case 'rechazado':
      case 'inactivo':
        return 'danger';
      case 'review':
      case 'revision':
        return 'info';
      default:
        return 'secondary';
    }
  }

  // Métodos de envío de correo (mantener para compatibilidad)
  enviarCorreoAprobacion() {
    const values = this.poppupgroup.value;
    const to = 'gaby.canova.aquije@gmail.com';
    const subject = 'Su cuenta ha sido activada';
    const text = `
    <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="text-align:center; color:#333;">Su cuenta ha sido activada</h2>
        <p style="font-size:16px; color:#555; text-align:center;">
          Hola, <strong>${values.nombre}</strong>,<br><br>
          Nos complace informarle que su cuenta ha sido activada exitosamente.
        </p>
        <div style="text-align:center; margin-top:30px;">
          <a href="http://localhost:4200/login"
             style="background-color:#007bff; color:#fff; padding:12px 24px; text-decoration:none; border-radius:5px; font-size:16px;">
            Ir a FiaoX Marketplace
          </a>
        </div>
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

  enviarCorreoRechazo() {
    const values = this.poppupgroup.value;
    const to = 'gaby.canova.aquije@gmail.com';
    const subject = 'Su cuenta ha sido suspendida';
    const text = `
    <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="text-align:center; color:#555;">Su cuenta ha sido suspendida</h2>
        <p style="font-size:16px; color:#555; text-align:center;">
          Hola, <strong>${values.nombre}</strong>,<br><br>
          Nos complace informarle que su cuenta ha sido suspendida por el siguiente motivo:<br><br>
          ${values.motivorechazo}
        </p>
        <p style="font-size:16px; color:#555; text-align:center; margin-top:20px;">
          Para obtener mayor información o asistencia, por favor comuníquese con nuestro equipo de soporte a través de
          <a href="mailto:chumpitazismael7@gmail.com" style="color:#007bff; text-decoration:none;">chumpitazismael7@gmail.com</a>.
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

  private mapToRow(u: any): UserWithDocuments {
    return {
      id: u.id,
      fullName:
        u.fullName ??
        u.name ??
        `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
      email: u.email ?? '—',
      status: u.status ?? 'pendiente',
      primaryRole: u.role ?? u.primaryRole ?? '',
      documents: u.documents ?? [], // si tu API no trae, queda []
      createdAt: u.createdAt ?? u.created_at ?? null,
    } as any;
  }

  private cargarCargos(): void {
    this.api.obtenerTipos('EST').subscribe({
      next: (data: any[]) => (this.listEstado = this.normalize(data)),
      error: () => (this.listEstado = []),
    });
  }

  private normalize(list: any[]): TipoUI[] {
    return (list ?? []).map((x) => ({
      id: x.id ?? x.ID ?? x.cod ?? x.codigo ?? x.cod_tipo,
      desc: x.desc ?? x.des_tipo ?? x.nombre ?? x.descripcion ?? '',
      cod: x.cod ?? x.codigo ?? x.cod_tipo ?? '',
      parent: x.parent ?? x.parent_id ?? x.parentCod ?? undefined, // <- añade esto
    }));
  }
}

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
  userDocuments: UserDocument[] = [];
  documentViewVisible = false;
  selectedDocumentUrl = '';

  // Filtros para la búsqueda
  searchFilters: UsersWithDocumentsFilters = {
    page: 1,
    limit: 10,
  };

  // Datos de ejemplo (mantener para compatibilidad)
  solicitudesTable: any[] = [
    {
      id: '1',
      cliente: 'Prueba',
      estado: 'Aprobado',
      descripcion: 'No se',
      fechacreacion: '2025-08-16',
    },
  ];

  // Formularios
  solicitudesform = new FormGroup({
    selectfiltro: new FormControl('todos', null),
    nombreapellido: new FormControl(null, null),
  });

  poppupgroup = new FormGroup({
    select: new FormControl('documentos', null),
    nombre: new FormControl(null, null),
    email: new FormControl(null, null),
    rol: new FormControl(null, null),
    socialsecurity: new FormControl(null, null),
    estado: new FormControl(null, null),
    motivorechazo: new FormControl(null, null),
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

  listaEstado: any[] = [
    { label: 'Aprobado', value: '1' },
    { label: 'Pendiente', value: '2' },
    { label: 'Rechazado', value: '3' },
  ];

  constructor(
    private mailService: MailService,
    private usersWithDocumentsService: UsersWithDocumentsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsersWithDocuments();
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
    this.usersWithDocumentsService
      .getUsersWithDocuments(this.searchFilters)
      .subscribe({
        next: (response) => {
          this.usersWithDocuments = response.data;
          this.totalUsers = response.pagination.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users with documents:', error);
          this.loading = false;
        },
      });
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
  onEditPoppup(user: UserWithDocuments | any): void {
    this.visible = true;

    if (user.fullName) {
      // Es un UserWithDocuments (nueva API)
      this.selectedUser = user;
      this.poppupgroup.patchValue({
        nombre: user.fullName,
        email: user.email,
        rol: user.primaryRole,
        socialsecurity: user.socialSecurity,
        estado: user.status,
      });
      this.userDocuments = user.documents;
    } else {
      // Es el formato anterior (compatibilidad)
      this.poppupgroup.patchValue({
        nombre: user.cliente,
        email: user.email,
        rol: user.rol,
        socialsecurity: user.socialsecurity,
        estado: user.estado,
      });
    }
  }

  // Método para actualizar cliente (versión unificada)
  actualizarCliente(): void {
    if (this.selectedUser) {
      // Usar nueva API
      const newStatus = this.poppupgroup.get('estado')?.value;
      if (!newStatus) return;

      this.loading = true;

      this.usersWithDocumentsService
        .updateUserStatus(this.selectedUser.id, { status: newStatus })
        .subscribe({
          next: (response) => {
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
    } else {
      // Lógica anterior (compatibilidad)
      this.loading = true;
      this.labelbtn = 'Actualizando';
      this.enviarCorreoRechazo();
      setTimeout(() => {
        this.loading = false;
        this.labelbtn = 'Actualizar';
      }, 2000);
    }
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
}

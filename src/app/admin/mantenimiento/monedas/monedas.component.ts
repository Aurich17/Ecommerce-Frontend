// /* eslint-disable @typescript-eslint/no-empty-function */
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MessageService, ConfirmationService } from 'primeng/api';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { ButtonModule } from 'primeng/button';
// import { TableModule } from 'primeng/table';
// import { DialogModule } from 'primeng/dialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { DropdownModule } from 'primeng/dropdown';
// import { InputSwitchModule } from 'primeng/inputswitch';
// import { TagModule } from 'primeng/tag';
// import { ToastModule } from 'primeng/toast';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { TooltipModule } from 'primeng/tooltip';
// import { ApiService } from '../../../../services/api.services';
// import {
//   Currency,
//   CreateCurrencyDto,
//   UpdateCurrencyDto,
// } from './domain/monedas.response';
// import { CurrencyFilters } from './domain/monedas.request';

// @Component({
//   selector: 'app-monedas',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule,
//     ButtonModule,
//     TableModule,
//     DialogModule,
//     InputTextModule,
//     DropdownModule,
//     InputSwitchModule,
//     TagModule,
//     ToastModule,
//     ConfirmDialogModule,
//     TooltipModule,
//   ],
//   templateUrl: './monedas.component.html',
//   styleUrls: ['./monedas.component.css'],
//   providers: [MessageService, ConfirmationService],
// })
// export class MonedasComponent implements OnInit {
//   // Propiedades del componente
//   visible = false;
//   loading = false;
//   isEditMode = false;
//   addRegister = true;
//   titulomantenimiento = 'Mantenimiento de Monedas';
//   labelbtn = 'Guardar';

//   // Datos y formularios
//   monedasTable: Currency[] = [];
//   monedasform!: FormGroup;
//   selectedMoneda: Currency | null = null;

//   // Filtros
//   selectedStatus: boolean | null = null;
//   statusOptions = [
//     { label: 'Todos', value: null },
//     { label: 'Activos', value: true },
//     { label: 'Inactivos', value: false },
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private apiService: ApiService,
//     private messageService: MessageService,
//     private confirmationService: ConfirmationService
//   ) {
//     this.initializeForm();
//   }

//   ngOnInit(): void {
//     this.getLandingMoneda();
//   }

//   /**
//    * Inicializa el formulario con validaciones según especificaciones de la API
//    */
//   private initializeForm(): void {
//     this.monedasform = this.fb.group({
//       description: ['', [Validators.required, Validators.maxLength(255)]],
//       prefijo: ['', [Validators.required, Validators.maxLength(10)]],
//       signo: ['', [Validators.required, Validators.maxLength(5)]],
//       status: [true], // Default: true según API
//     });
//   }

//   /**
//    * Obtiene la lista de monedas con filtros aplicados
//    */
//   async getLandingMoneda(): Promise<void> {
//     try {
//       this.loading = true;

//       const filters: CurrencyFilters = {};
//       if (this.selectedStatus !== null) {
//         filters.status = this.selectedStatus;
//       }

//       const response = await this.apiService.getCurrencies(filters).toPromise();
//       this.monedasTable = response || [];
//     } catch (error: any) {
//       console.error('Error al obtener monedas:', error);
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Error al cargar las monedas',
//       });
//     } finally {
//       this.loading = false;
//     }
//   }

//   /**
//    * Abre el dialog para agregar una nueva moneda
//    */
//   agregarMoneda(): void {
//     this.isEditMode = false;
//     this.selectedMoneda = null;
//     this.addRegister = true;
//     this.monedasform.reset({
//       description: '',
//       prefijo: '',
//       signo: '',
//       status: true,
//     });
//     this.titulomantenimiento = 'Agregar Nueva Moneda';
//     this.labelbtn = 'Guardar';
//     this.visible = true;
//   }

//   /**
//    * Abre el dialog para editar una moneda existente
//    */
//   editarMoneda(moneda: Currency): void {
//     this.isEditMode = true;
//     this.selectedMoneda = moneda;
//     this.addRegister = false;

//     this.monedasform.patchValue({
//       description: moneda.description,
//       prefijo: moneda.prefijo,
//       signo: moneda.signo,
//       status: moneda.status,
//     });

//     this.titulomantenimiento = 'Editar Moneda';
//     this.labelbtn = 'Actualizar';
//     this.visible = true;
//   }

//   /**
//    * Guarda los datos del formulario (crear o actualizar)
//    */
//   async guardarData(): Promise<void> {
//     if (this.monedasform.invalid) {
//       this.markFormGroupTouched();
//       return;
//     }

//     try {
//       this.loading = true;
//       const formData = this.monedasform.value;

//       if (this.isEditMode && this.selectedMoneda) {
//         // Actualizar moneda existente
//         const updateDto: UpdateCurrencyDto = {
//           description: formData.description,
//           prefijo: formData.prefijo,
//           signo: formData.signo,
//           status: formData.status,
//         };

//         await this.apiService
//           .updateCurrency(this.selectedMoneda.id, updateDto)
//           .toPromise();

//         this.messageService.add({
//           severity: 'success',
//           summary: 'Éxito',
//           detail: 'Moneda actualizada correctamente',
//         });
//       } else {
//         // Crear nueva moneda
//         const createDto: CreateCurrencyDto = {
//           description: formData.description,
//           prefijo: formData.prefijo,
//           signo: formData.signo,
//           status: formData.status,
//         };

//         await this.apiService.createCurrency(createDto).toPromise();

//         this.messageService.add({
//           severity: 'success',
//           summary: 'Éxito',
//           detail: 'Moneda creada correctamente',
//         });
//       }

//       this.visible = false;
//       await this.getLandingMoneda();
//     } catch (error: any) {
//       console.error('Error al guardar moneda:', error);

//       let errorMessage = 'Error al guardar la moneda';
//       if (error?.error?.message) {
//         errorMessage = error.error.message;
//       }

//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: errorMessage,
//       });
//     } finally {
//       this.loading = false;
//     }
//   }

//   /**
//    * Alterna el estado de una moneda (activo/inactivo)
//    */
//   async toggleStatus(moneda: Currency): Promise<void> {
//     try {
//       this.loading = true;

//       await this.apiService.toggleCurrencyStatus(moneda.id).toPromise();

//       this.messageService.add({
//         severity: 'success',
//         summary: 'Éxito',
//         detail: `Moneda ${
//           moneda.status ? 'desactivada' : 'activada'
//         } correctamente`,
//       });

//       await this.getLandingMoneda();
//     } catch (error: any) {
//       console.error('Error al cambiar estado:', error);
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Error al cambiar el estado de la moneda',
//       });
//     } finally {
//       this.loading = false;
//     }
//   }

//   /**
//    * Elimina una moneda con confirmación
//    */
//   eliminarMoneda(moneda: Currency): void {
//     this.confirmationService.confirm({
//       message: `¿Está seguro de eliminar la moneda "${moneda.description}"?`,
//       header: 'Confirmar Eliminación',
//       icon: 'pi pi-exclamation-triangle',
//       acceptLabel: 'Sí, eliminar',
//       rejectLabel: 'Cancelar',
//       accept: async () => {
//         try {
//           this.loading = true;

//           await this.apiService.deleteCurrency(moneda.id).toPromise();

//           this.messageService.add({
//             severity: 'success',
//             summary: 'Éxito',
//             detail: 'Moneda eliminada correctamente',
//           });

//           await this.getLandingMoneda();
//         } catch (error: any) {
//           console.error('Error al eliminar moneda:', error);
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Error al eliminar la moneda',
//           });
//         } finally {
//           this.loading = false;
//         }
//       },
//     });
//   }

//   /**
//    * Maneja el cambio en el filtro de estado
//    */
//   onStatusFilterChange(): void {
//     this.getLandingMoneda();
//   }

//   /**
//    * Limpia todos los filtros aplicados
//    */
//   clearFilters(): void {
//     this.selectedStatus = null;
//     this.getLandingMoneda();
//   }

//   /**
//    * Cancela la operación y cierra el dialog
//    */
//   cancelar(): void {
//     this.visible = false;
//     this.monedasform.reset();
//     this.selectedMoneda = null;
//   }

//   /**
//    * Marca todos los campos del formulario como tocados para mostrar errores
//    */
//   private markFormGroupTouched(): void {
//     Object.keys(this.monedasform.controls).forEach((key) => {
//       const control = this.monedasform.get(key);
//       control?.markAsTouched();
//     });
//   }

//   /**
//    * Obtiene el mensaje de error para un campo específico
//    */
//   getFieldError(fieldName: string): string {
//     const field = this.monedasform.get(fieldName);

//     if (field?.errors && field.touched) {
//       if (field.errors['required']) {
//         return `${this.getFieldLabel(fieldName)} es requerido`;
//       }
//       if (field.errors['maxlength']) {
//         const maxLength = field.errors['maxlength'].requiredLength;
//         return `${this.getFieldLabel(
//           fieldName
//         )} no puede exceder ${maxLength} caracteres`;
//       }
//     }

//     return '';
//   }

//   /**
//    * Obtiene la etiqueta amigable para un campo
//    */
//   private getFieldLabel(fieldName: string): string {
//     const labels: Record<string, string> = {
//       description: 'La descripción',
//       prefijo: 'El prefijo',
//       signo: 'El símbolo',
//     };

//     return labels[fieldName] || fieldName;
//   }

//   exportExcel() {}
//   exportPdf() {}
//   exportCsv() {}
// }

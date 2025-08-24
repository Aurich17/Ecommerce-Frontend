import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import {
  ProductListItem,
  CreateProductDto,
  UpdateProductDto,
  ProductListResponse,
  ProductDetail,
} from './domain/productos.response';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { SessionService } from '../../../../services/session/session.service';
import { ApiService } from '../../../../services/api.services';
// import { ImagekitService } from '../../../../services/imagekit.service';
import { ImagekitClient } from '../../../../services/imagekit.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
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
    InputNumberModule,
    InputTextareaModule,
    ToastModule,
    ConfirmDialogModule,
    FileUploadModule,
    TooltipModule,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ProductosComponent implements OnInit {
  visible: boolean = false;
  titulomantenimiento: string = 'Registrar Producto';
  labelbtn: string = 'Guardar';
  loading: boolean = false;
  addRegister: boolean = false;
  productosTable: ProductListItem[] = [];
  currentProductId: number | null = null;
  currentUserId: string = '';
  uploadedImageUrl: string = '';
  imageFile: File | null = null;

  // Mapeo de códigos de moneda a códigos ISO de 3 dígitos
  currencyMap: { [key: string]: string } = {
    USD: '840',
    EUR: '978',
    GBP: '826',
    JPY: '392',
    PEN: '604',
  };

  // Mapeo de códigos de moneda a símbolos
  currencySymbolMap: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PEN: 'S/',
  };

  productosform = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    descuento: new FormControl(0, [Validators.min(0), Validators.max(100)]),
    moneda: new FormControl('USD', [Validators.required]),
    simboloMoneda: new FormControl('$', [Validators.required]),
    urlImagen: new FormControl(''),
  });

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private imagekitService: ImagekitClient
  ) {}

  ngOnInit() {
    this.sessionService.restore();
    this.currentUserId = this.sessionService.snapshot.token
      ? this.getUserIdFromSession()
      : '';
    this.getLandingProduct();

    // Listener para actualizar el símbolo de moneda automáticamente
    this.productosform.get('moneda')?.valueChanges.subscribe((currency) => {
      if (currency) {
        this.productosform.patchValue({
          simboloMoneda: this.currencySymbolMap[currency] || '$',
        });
      }
    });
  }

  private getUserIdFromSession(): string {
    // Generar UUID ya que no tenemos ID de usuario en la sesión
    return this.generateUUID();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  getCurrencySymbol(currencyTab: string): string {
    return this.currencySymbolMap[currencyTab] || '$';
  }

  getLandingProduct() {
    if (!this.currentUserId) return;

    this.apiService
      .getProducts({ sellerUserId: this.currentUserId })
      .subscribe({
        next: (response: ProductListResponse | any) => {
          // Log para ver el shape real
          console.log('API products response', response);

          // Normalización defensiva
          const raw = response?.data ?? response;
          const list = Array.isArray(raw)
            ? raw
            : raw?.items ?? raw?.rows ?? (raw ? [raw] : []);

          this.productosTable = list as ProductListItem[];
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar productos',
          });
        },
      });
  }

  exportExcel() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Funcionalidad de exportación en desarrollo',
    });
  }

  exportPdf() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Funcionalidad de exportación en desarrollo',
    });
  }

  exportCsv() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Funcionalidad de exportación en desarrollo',
    });
  }

  agregarProducto() {
    this.productosform.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      descuento: 0,
      moneda: 'USD',
      simboloMoneda: '$',
      urlImagen: '',
    });
    this.currentProductId = null;
    this.uploadedImageUrl = '';
    this.imageFile = null;
    this.addRegister = true;
    this.titulomantenimiento = 'Agregar Producto';
    this.labelbtn = 'Guardar';
    this.visible = true;
  }

  onEditPoppup(product: ProductListItem) {
    this.currentProductId = product.id;
    this.uploadedImageUrl = product.url_img || '';
    this.productosform.patchValue({
      nombre: product.name,
      descripcion: product.description,
      precio: product.price_amount,
      stock: product.stock,
      descuento: product.discount_percent || 0,
      moneda: product.currency_tab,
      simboloMoneda: this.currencySymbolMap[product.currency_tab] || '$',
      urlImagen: product.url_img || '',
    });
    this.addRegister = false;
    this.titulomantenimiento = 'Editar Producto';
    this.labelbtn = 'Actualizar';
    this.visible = true;
  }

  onDeleteRow(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este producto?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.deleteProduct(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Producto eliminado correctamente',
            });
            this.getLandingProduct();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el producto',
            });
          },
        });
      },
    });
  }

  async guardarData() {
    if (this.productosform.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos',
      });
      Object.keys(this.productosform.controls).forEach((key) => {
        this.productosform.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.productosform.value;

    // Manejar la subida de imagen si hay un archivo seleccionado
    let imageUrl = this.uploadedImageUrl || formData.urlImagen || null;

    if (this.imageFile) {
      try {
        const uploadResponse = await this.imagekitService.uploadAndSave(
          this.imageFile,
          'productos'
        );
        imageUrl = uploadResponse.url;
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al subir la imagen',
        });
        this.loading = false;
        return;
      }
    }

    if (this.addRegister) {
      // Crear nuevo producto
      const createDto: CreateProductDto = {
        sellerUserId: this.currentUserId,
        name: formData.nombre!,
        description: formData.descripcion!,
        priceAmount: formData.precio!,
        currencyTab: formData.moneda!,
        currencyCod: this.currencyMap[formData.moneda!] || '840',
        stock: formData.stock!,
        discountPercent: formData.descuento || 0,
        urlImg: imageUrl || undefined,
      };

      this.apiService.createProduct(createDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto creado correctamente',
          });
          this.visible = false;
          this.getLandingProduct();
          this.imageFile = null;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error al crear el producto: ' +
              (error.error?.message || 'Error desconocido'),
          });
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      // Actualizar producto existente
      const updateDto: UpdateProductDto = {
        name: formData.nombre!,
        description: formData.descripcion!,
        priceAmount: formData.precio!,
        currencyTab: formData.moneda!,
        currencyCod: this.currencyMap[formData.moneda!] || '840',
        stock: formData.stock!,
        discountPercent: formData.descuento || 0,
        urlImg: imageUrl || undefined,
      };

      this.apiService
        .updateProduct(this.currentProductId!, updateDto)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Producto actualizado correctamente',
            });
            this.visible = false;
            this.getLandingProduct();
            this.imageFile = null;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Error al actualizar el producto: ' +
                (error.error?.message || 'Error desconocido'),
            });
          },
          complete: () => {
            this.loading = false;
          },
        });
    }
  }

  onImageUpload(event: any) {
    const file = event.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Solo se permiten archivos de imagen',
        });
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La imagen no debe superar los 5MB',
        });
        return;
      }

      // Almacenar el archivo para subirlo después
      this.imageFile = file;

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Imagen seleccionada para subir',
      });
    }
  }

  toggleProductStatus(product: ProductListItem) {
    const action = product.enabled ? 'disable' : 'enable';
    const operation = product.enabled
      ? this.apiService.disableProduct(product.id)
      : this.apiService.enableProduct(product.id);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Producto ${
            action === 'disable' ? 'desactivado' : 'activado'
          } correctamente`,
        });
        this.getLandingProduct();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error al ${
            action === 'disable' ? 'desactivar' : 'activar'
          } el producto`,
        });
      },
    });
  }
}

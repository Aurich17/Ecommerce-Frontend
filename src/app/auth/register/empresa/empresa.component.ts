import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
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
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

type Pais = { id: string; nombre: string; iso2: string };
type Provincia = { id: string; nombre: string; paisId: string };
type Municipio = { id: string; nombre: string; provId: string };

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    InputNumberModule,
    LeafletModule,
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css',
  providers: [MessageService],
})
export class EmpresaComponent {
  constructor(private router: Router, private messageService: MessageService) {}

  visible = false;
  items: MenuItem[] = [
    { label: 'Información Básica' },
    { label: 'Ubicación' },
    { label: 'Representante Legal' },
    { label: 'Credenciales' },
    { label: 'Confirmación' },
  ];

  listaTipoNegocio: any[] = [];
  listaCiudad: any[] = [];
  listaDepartamento: any[] = [];
  listaCargo: any[] = [];

  listPaises: any[] = [];
  listProvincias: any[] = [];
  listMunicipios: any[] = [];

  private readonly PAISES: Pais[] = [
    { id: 'PE', nombre: 'Perú', iso2: 'PE' },
    { id: 'MX', nombre: 'México', iso2: 'MX' },
    { id: 'ES', nombre: 'España', iso2: 'ES' },
  ];

  private readonly PROVINCIAS: Provincia[] = [
    { id: 'PE-LIM', nombre: 'Lima', paisId: 'PE' },
    { id: 'PE-CUS', nombre: 'Cusco', paisId: 'PE' },
    { id: 'MX-JAL', nombre: 'Jalisco', paisId: 'MX' },
    { id: 'MX-CMX', nombre: 'Ciudad de México', paisId: 'MX' },
    { id: 'ES-M', nombre: 'Comunidad de Madrid', paisId: 'ES' },
    { id: 'ES-CT', nombre: 'Cataluña', paisId: 'ES' },
  ];

  private readonly MUNICIPIOS: Municipio[] = [
    { id: 'PE-LIM-MIR', nombre: 'Miraflores', provId: 'PE-LIM' },
    { id: 'PE-LIM-SIS', nombre: 'San Isidro', provId: 'PE-LIM' },
    { id: 'PE-CUS-PIS', nombre: 'Pisac', provId: 'PE-CUS' },
    { id: 'MX-JAL-GDL', nombre: 'Guadalajara', provId: 'MX-JAL' },
    { id: 'MX-JAL-ZAP', nombre: 'Zapopan', provId: 'MX-JAL' },
    { id: 'MX-CMX-COY', nombre: 'Coyoacán', provId: 'MX-CMX' },
    { id: 'ES-M-MAD', nombre: 'Madrid', provId: 'ES-M' },
    { id: 'ES-CT-BCN', nombre: 'Barcelona', provId: 'ES-CT' },
  ];

  loadingPais = false;
  loadingProv = false;
  loadingMun = false;
  activeIndex = 0;
  cliente = '';

  basicForm = new FormGroup({
    nombrecompleto: new FormControl<string | null>('', Validators.required),
    ruc: new FormControl<string | null>('', Validators.required),
    tiponegocio: new FormControl<number | null>(null),
    fechafundacion: new FormControl<Date | null>(null),
    numeroempleados: new FormControl<number | null>(null),
    pais: new FormControl<string | null>(null),
    provincia: new FormControl<string | null>(null),
    ciudad: new FormControl<string | null>(null),
  });

  ubicacionForm = new FormGroup({
    direccionfiscal: new FormControl('', null),
    ciudad: new FormControl('', null),
    departamento: new FormControl('', null),
    codigopostal: new FormControl('', null),
    sitioweb: new FormControl('', null),
  });

  representanteForm = new FormGroup({
    nombrerepresentante: new FormControl('', null),
    cargo: new FormControl(null, null),
    telefono: new FormControl(null, null),
    telefonoalt: new FormControl(null, null),
    correo: new FormControl(null, null),
  });

  credencialesForm = new FormGroup({
    correo: new FormControl('', null),
    contrasenia: new FormControl(null, null),
  });

  socialsecurity = new FormGroup({
    socialsecurity: new FormControl(''),
  });

  ngOnInit(): void {
    this.listPaises = this.PAISES;
    this.basicForm.get('pais')!.valueChanges.subscribe((paisId) => {
      this.basicForm.patchValue(
        { provincia: null, ciudad: null },
        { emitEvent: false }
      );
      this.listMunicipios = [];
      this.listProvincias = this.PROVINCIAS.filter((p) => p.paisId === paisId);
    });

    this.basicForm.get('provincia')!.valueChanges.subscribe((provId) => {
      this.basicForm.patchValue({ ciudad: null }, { emitEvent: false });
      this.listMunicipios = this.MUNICIPIOS.filter((m) => m.provId === provId);
    });
  }

  next() {
    if (this.activeIndex === 0 && this.basicForm.invalid) {
      this.basicForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obligatorios',
        detail: 'Falta llenar campos.',
      });
      return;
    }
    if (this.activeIndex === 1 && this.ubicacionForm.invalid) {
      this.ubicacionForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obligatorios',
        detail: 'Falta llenar campos.',
      });
      return;
    }
    if (this.activeIndex === 2 && this.representanteForm.invalid) {
      this.representanteForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obligatorios',
        detail: 'Falta llenar campos.',
      });
      return;
    }
    if (this.activeIndex === 3 && this.credencialesForm.invalid) {
      this.credencialesForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obligatorios',
        detail: 'Falta llenar campos.',
      });
      return;
    }
    this.activeIndex++;
  }

  prev() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
  }

  async finish() {
    this.visible = true;
  }

  copy() {
    const value = this.socialsecurity.get('socialsecurity')?.value || '';
    if (value) {
      navigator.clipboard.writeText(value).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copiado',
          detail: 'Se ha copiado al portapapeles.',
          life: 2500,
        });
      });
    }
  }

  private norm(s?: any): string {
    return (s ?? '')
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  private findByName<T extends Record<string, any>>(
    list: T[],
    target: string,
    nameFields: string[] = ['nombre', 'label']
  ): T | undefined {
    const t = this.norm(target);
    if (!t) return undefined;
    let hit = list.find((x) => nameFields.some((f) => this.norm(x?.[f]) === t));
    if (hit) return hit;
    hit = list.find((x) =>
      nameFields.some((f) => this.norm(x?.[f]).includes(t))
    );
    if (hit) return hit;
    for (const part of t
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)) {
      hit = list.find((x) =>
        nameFields.some((f) => this.norm(x?.[f]).includes(part))
      );
      if (hit) return hit;
    }
    return undefined;
  }

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }),
    ],
    zoom: 6,
    center: L.latLng(40.4168, -3.7038),
  };

  private map!: L.Map;
  searchAddress = '';
  searchResults: any[] = [];
  showSearchResults = false;
  isSearching = false;
  private searchTimeout: any;

  onMapReady(map: L.Map) {
    this.map = map;
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) this.map.removeLayer(layer);
      });
      L.marker([coords.lat, coords.lng]).addTo(this.map);

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1`
      )
        .then((res) => res.json())
        .then((data) => {
          const addr = data.address || {};
          const city =
            addr.city || addr.town || addr.village || addr.municipality || '';
          const state = addr.state || addr.region || addr.state_district || '';
          const postcode = addr.postcode || '';
          const countryName = addr.country || '';
          const iso2 = (addr.country_code || '').toUpperCase();

          this.ubicacionForm.patchValue({
            ciudad: city,
            departamento: state,
            codigopostal: postcode,
            direccionfiscal: data.display_name,
          });

          let paisItem = (this.listPaises as Pais[]).find(
            (p) => p.iso2.toUpperCase() === iso2
          );
          if (!paisItem)
            paisItem = this.findByName(this.listPaises, countryName) as
              | Pais
              | undefined;
          if (paisItem)
            this.basicForm.patchValue(
              { pais: paisItem.id },
              { emitEvent: false }
            );

          if (paisItem)
            this.listProvincias = this.PROVINCIAS.filter(
              (p) => p.paisId === paisItem!.id
            );

          const provItem = this.findByName(this.listProvincias, state) as
            | Provincia
            | undefined;
          if (provItem)
            this.basicForm.patchValue(
              { provincia: provItem.id },
              { emitEvent: false }
            );

          if (provItem)
            this.listMunicipios = this.MUNICIPIOS.filter(
              (m) => m.provId === provItem!.id
            );

          const munItem = this.findByName(this.listMunicipios, city) as
            | Municipio
            | undefined;
          if (munItem)
            this.basicForm.patchValue(
              { ciudad: munItem.id },
              { emitEvent: false }
            );

          const faltan: string[] = [];
          if (!paisItem) faltan.push('país');
          if (!provItem) faltan.push('provincia');
          if (!munItem) faltan.push('ciudad');
          if (faltan.length) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Ubicación parcial',
              detail: `No se pudo mapear: ${faltan.join(', ')}.`,
              life: 3000,
            });
          }
        })
        .catch((err) => console.error('Error reverse geocoding', err));
    });
  }

  searchAddressOnMap() {
    // Limpiar timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!this.searchAddress.trim()) {
      this.searchResults = [];
      this.showSearchResults = false;
      this.isSearching = false;
      return;
    }

    // Debounce de 300ms para búsqueda más responsiva
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  // Método para búsqueda inmediata (cuando se hace clic en el botón)
  searchImmediately() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.searchAddress.trim()) {
      this.performSearch();
    }
  }

  private performSearch() {
    if (!this.searchAddress.trim()) {
      return;
    }

    this.isSearching = true;
    
    // Agregar más países si es necesario
    const searchQuery = encodeURIComponent(this.searchAddress.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=8&addressdetails=1&countrycodes=pe,mx,es,co,ar,cl,ec,bo,py,uy,ve`;
    
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        this.isSearching = false;
        
        if (!Array.isArray(data)) {
          throw new Error('Respuesta inválida del servidor');
        }
        
        this.searchResults = data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          address: item.address || {},
          importance: item.importance || 0,
          place_id: item.place_id
        })).sort((a: any, b: any) => b.importance - a.importance); // Ordenar por relevancia
        
        this.showSearchResults = true;
        
        if (this.searchResults.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sin resultados',
            detail: `No se encontraron direcciones para "${this.searchAddress}". Intenta con términos más específicos.`,
            life: 4000,
          });
        } else {
          console.log(`Encontrados ${this.searchResults.length} resultados para: ${this.searchAddress}`);
        }
      })
      .catch((err) => {
        this.isSearching = false;
        console.error('Error searching address:', err);
        
        let errorMessage = 'No se pudo realizar la búsqueda de dirección.';
        if (err.message.includes('HTTP')) {
          errorMessage = 'Error del servidor de mapas. Intenta nuevamente.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Sin conexión a internet. Verifica tu conexión.';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error de búsqueda',
          detail: errorMessage,
          life: 5000,
        });
        this.searchResults = [];
        this.showSearchResults = false;
      });
  }

  selectSearchResult(result: any) {
    try {
      // Verificar que el mapa esté disponible
      if (!this.map) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error del mapa',
          detail: 'El mapa no está disponible. Intenta recargar la página.',
          life: 3000,
        });
        return;
      }

      // Centrar el mapa en la ubicación seleccionada
      this.map.setView([result.lat, result.lon], 16);
      
      // Remover marcadores existentes
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) this.map.removeLayer(layer);
      });
      
      // Agregar nuevo marcador con popup
      const marker = L.marker([result.lat, result.lon]).addTo(this.map);
      marker.bindPopup(result.display_name).openPopup();
      
      // Llenar formularios con la información de la dirección
      const addr = result.address || {};
      const city = addr.city || addr.town || addr.village || addr.municipality || '';
      const state = addr.state || addr.region || addr.state_district || '';
      const postcode = addr.postcode || '';
      const countryName = addr.country || '';
      const iso2 = (addr.country_code || '').toUpperCase();

      // Actualizar formulario de ubicación
      this.ubicacionForm.patchValue({
        ciudad: city,
        departamento: state,
        codigopostal: postcode,
        direccionfiscal: result.display_name,
      });

      // Buscar y actualizar país
      let paisItem = (this.listPaises as Pais[]).find(
        (p) => p.iso2.toUpperCase() === iso2
      );
      if (!paisItem) {
        paisItem = this.findByName(this.listPaises, countryName) as Pais | undefined;
      }
      
      if (paisItem) {
        this.basicForm.patchValue(
          { pais: paisItem.id },
          { emitEvent: false }
        );
        
        // Actualizar lista de provincias
        this.listProvincias = this.PROVINCIAS.filter(
          (p) => p.paisId === paisItem!.id
        );

        // Buscar y actualizar provincia
        const provItem = this.findByName(this.listProvincias, state) as Provincia | undefined;
        if (provItem) {
          this.basicForm.patchValue(
            { provincia: provItem.id },
            { emitEvent: false }
          );
          
          // Actualizar lista de municipios
          this.listMunicipios = this.MUNICIPIOS.filter(
            (m) => m.provId === provItem!.id
          );

          // Buscar y actualizar municipio
          const munItem = this.findByName(this.listMunicipios, city) as Municipio | undefined;
          if (munItem) {
            this.basicForm.patchValue(
              { ciudad: munItem.id },
              { emitEvent: false }
            );
          }
        }
      }

      // Ocultar resultados de búsqueda
      this.showSearchResults = false;
      this.searchAddress = result.display_name;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Ubicación seleccionada',
        detail: 'La dirección ha sido seleccionada y el mapa actualizado.',
        life: 3000,
      });
      
    } catch (error) {
      console.error('Error al seleccionar resultado:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al seleccionar la ubicación.',
        life: 3000,
      });
    }
  }

  clearSearch() {
    // Limpiar timeout si existe
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchAddress = '';
    this.searchResults = [];
    this.showSearchResults = false;
    this.isSearching = false;
  }
}

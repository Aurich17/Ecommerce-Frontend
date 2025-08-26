import { Component, OnInit } from '@angular/core';
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
import { MailService } from '../../../../services/mail/mail.service';
import { ImagekitClient } from '../../../../services/imagekit.service';

interface Pais {
  id: string;
  nombre: string;
  iso2: string;
}
interface Provincia {
  id: string;
  nombre: string;
  paisId: string;
}
interface Municipio {
  id: string;
  nombre: string;
  provId: string;
}

import {
  EmpresaApiService,
  RegistroEmpresaRequest,
} from '../../../../services/empresa-api.service';
import { ApiService } from '../../../../services/api.services';

interface TipoUI {
  id?: number | string;
  desc: string;
  cod: string;
  parent?: string;
}

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
export class EmpresaComponent implements OnInit {
  // En el constructor, agregar el servicio
  constructor(
    private router: Router,
    private messageService: MessageService,
    private mailService: MailService,
    private ik: ImagekitClient,
    private empresaApiService: EmpresaApiService,
    private api: ApiService // Agregar esta línea
  ) {}

  logoUrl: string | null = null;
  // Documentos
  selectedDocs: File[] = []; // seleccionados (pendientes)
  listNegocios: TipoUI[] = [];
  listCargos: TipoUI[] = [];
  uploadedDocs: { name: string; url: string; type: string }[] = []; // subidos
  uploadingDocs = false;

  private COUNTRY_MAP: Record<string, string> = {
    peru: 'pe',
    perú: 'pe',
    mexico: 'mx',
    méxico: 'mx',
    spain: 'es',
    españa: 'es',
    colombia: 'co',
    argentina: 'ar',
    chile: 'cl',
    ecuador: 'ec',
    bolivia: 'bo',
    paraguay: 'py',
    uruguay: 'uy',
    venezuela: 've',
  };

  visible = false;
  items: MenuItem[] = [
    { label: 'Información Básica' },
    { label: 'Ubicación' },
    { label: 'Representante Legal' },
    { label: 'Credenciales' },
    { label: 'Documentos' },
    { label: 'Confirmación' },
  ];

  private searchTimeout: any;
  private searchAbort?: AbortController; // <- NUEVO
  private lastQueryId = 0; // <- para ignorar respuestas viejas
  isSearching = false;

  listaTipoNegocio: any[] = [];
  listaCiudad: any[] = [];
  listaDepartamento: any[] = [];

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

  private detectCountryFromQuery(q: string): string | null {
    const lower = q
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
    for (const name in this.COUNTRY_MAP) {
      if (lower.includes(name)) return this.COUNTRY_MAP[name];
    }
    return null;
  }
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
    this.cargarNegocio();
    this.cargarCargos();
    this.logoUrl = localStorage.getItem('logoUrl');
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
    // Validación para la sección de documentos
    if (this.activeIndex === 4) {
      if (this.selectedDocs.length === 0 && this.uploadedDocs.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Documentos Requeridos',
          detail: 'Debe seleccionar al menos un documento para continuar.',
        });
        return;
      }
    }
    this.activeIndex++;
  }

  clearPickedDocs() {
    this.selectedDocs = [];
  }

  removeUploadedDoc(i: number) {
    this.uploadedDocs.splice(i, 1);
  }

  async uploadPickedDocs() {
    if (!this.selectedDocs.length) return;
    this.uploadingDocs = true;
    try {
      for (const f of this.selectedDocs) {
        // carpeta separada para empresas
        const res: any = await this.ik.uploadAndSave(f, '/empresas', [
          'empresa',
          'documento',
        ]);
        // si es imagen, genera URL transformada; si es PDF, usa la URL directa
        const isImage = (f.type || '').startsWith('image/');
        const url = isImage
          ? this.ik.url({ path: res.filePath }, { w: 1200, q: 80, f: 'auto' })
          : res.url;

        this.uploadedDocs.push({ name: f.name, url, type: f.type });
      }
      this.selectedDocs = [];
      this.messageService.add({
        severity: 'success',
        summary: 'Documentos',
        detail: 'Documentos subidos.',
      });
    } catch (err: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al subir',
        detail: err?.message || 'Intenta de nuevo.',
      });
    } finally {
      this.uploadingDocs = false;
    }
  }

  prev() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
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

  enviarCorreo() {
    const values = this.basicForm.value;
    const valuescorreo = this.representanteForm.value;
    const to = valuescorreo.correo || '';
    const subject = 'Cuenta registrada con éxito';
    const text = `
    <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="text-align:center; color:#333;">Cuenta registrada con éxito</h2>
        <p style="font-size:16px; color:#555; text-align:center;">
          Estimado/a representante de <strong>${values.nombrecompleto}</strong>,<br><br>
          Su empresa ha sido registrada exitosamente en nuestra plataforma.
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

  searchAddressOnMap() {
    // Debounce más largo y mínimo de caracteres
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    const q = (this.searchAddress || '').trim();
    if (q.length < 3) {
      // si borran o hay poco texto, limpia resultados
      this.cancelSearch();
      this.searchResults = [];
      this.showSearchResults = false;
      this.isSearching = false;
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.performSearch(false); // false => no mostrar toasts si no hay resultados mientras escribe
    }, 600);
  }

  // Método para búsqueda inmediata (cuando se hace clic en el botón)
  searchImmediately() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    const q = (this.searchAddress || '').trim();
    if (q.length < 3) return;
    this.performSearch(true); // true => fue intención explícita (Enter/botón)
  }

  private cancelSearch() {
    try {
      this.searchAbort?.abort();
    } catch {}
    this.searchAbort = undefined;
  }
  private performSearch(showNoResultsToast: boolean) {
    const raw = (this.searchAddress || '').trim();
    if (!raw) return;

    // 1) Cancela la búsqueda anterior
    this.cancelSearch();
    const abort = new AbortController();
    this.searchAbort = abort;
    this.isSearching = true;

    // 2) ¿El usuario especificó país en el texto?
    const detectedCC = this.detectCountryFromQuery(raw); // ej. "pe"
    // 3) País desde el formulario (para sesgo por defecto)
    const paisId = (this.basicForm.get('pais')?.value as string | null) || '';
    const fallbackCCs = 'pe,mx,es,co,ar,cl,ec,bo,py,uy,ve';

    // 4) Limpia el query si contiene el país al final (opcional)
    const cleaned = raw.replace(
      /\s*,\s*(per[uú]|mexico|m[eé]xico|espa[ñn]a|spain|colombia|argentina|chile|ecuador|bolivia|paraguay|uruguay|venezuela)\s*$/i,
      ''
    );
    const q = encodeURIComponent(cleaned || raw);

    // 5) Construye URL en modo “dirigido” si hay país explícito;
    //    si no, usa viewbox como sesgo (bounded=1 opcional)
    let viewboxParam = '';
    let boundedParam = '';
    if (!detectedCC && this.map) {
      const b = this.map.getBounds();
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();
      viewboxParam = `&viewbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}`;
      boundedParam = '&bounded=1'; // <- si quieres solo sesgo, quita esta línea
    }

    const countryCodes = detectedCC
      ? detectedCC
      : paisId
      ? paisId.toLowerCase()
      : fallbackCCs;

    const baseUrl =
      `https://nominatim.openstreetmap.org/search` +
      `?format=jsonv2` +
      `&q=${q}` +
      `&limit=8` +
      `&addressdetails=1` +
      `&accept-language=es` +
      `&countrycodes=${countryCodes}` +
      `${viewboxParam}${detectedCC ? '' : boundedParam}` + // ojo: si hay país detectado, NO bounded
      `&dedupe=1`;

    const queryId = ++this.lastQueryId;

    const runFetch = (url: string, isFallback = false) => {
      fetch(url, { signal: abort.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (queryId !== this.lastQueryId) return; // respuesta vieja, ignorar

          this.isSearching = false;
          if (!Array.isArray(data)) throw new Error('Respuesta inválida');

          this.searchResults = data
            .map((item: any) => ({
              display_name: item.display_name,
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
              address: item.address || {},
              importance: item.importance || 0,
              place_id: item.place_id,
            }))
            .sort((a: any, b: any) => b.importance - a.importance);

          this.showSearchResults = this.searchResults.length > 0;

          // 6) Fallback: si no hay resultados y NO hemos intentado global
          if (!this.searchResults.length && !isFallback) {
            const globalUrl =
              `https://nominatim.openstreetmap.org/search` +
              `?format=jsonv2` +
              `&q=${q}` +
              `&limit=8` +
              `&addressdetails=1` +
              `&accept-language=es` +
              `&countrycodes=${fallbackCCs}`; // sin viewbox ni bounded
            this.isSearching = true;
            runFetch(globalUrl, true);
            return;
          }

          if (!this.searchResults.length && showNoResultsToast) {
            this.messageService.add({
              severity: 'info',
              summary: 'Sin resultados',
              detail: `No se encontraron direcciones para "${raw}". Intenta ser más específico.`,
              life: 4000,
            });
          }
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return; // cancelado

          if (queryId !== this.lastQueryId) return;
          this.isSearching = false;

          const msg = String(err?.message || '');
          let detail = 'No se pudo realizar la búsqueda.';
          if (msg.includes('HTTP'))
            detail = 'Error del servidor de mapas. Intenta nuevamente.';
          else if (msg.includes('Failed to fetch'))
            detail = 'Sin conexión a internet. Verifica tu conexión.';

          this.messageService.add({
            severity: 'error',
            summary: 'Error de búsqueda',
            detail,
            life: 5000,
          });
          this.searchResults = [];
          this.showSearchResults = false;
        });
    };

    runFetch(baseUrl);
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
      const city =
        addr.city || addr.town || addr.village || addr.municipality || '';
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
        paisItem = this.findByName(this.listPaises, countryName) as
          | Pais
          | undefined;
      }

      if (paisItem) {
        this.basicForm.patchValue({ pais: paisItem.id }, { emitEvent: false });

        // Actualizar lista de provincias
        this.listProvincias = this.PROVINCIAS.filter(
          (p) => p.paisId === paisItem!.id
        );

        // Buscar y actualizar provincia
        const provItem = this.findByName(this.listProvincias, state) as
          | Provincia
          | undefined;
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
          const munItem = this.findByName(this.listMunicipios, city) as
            | Municipio
            | undefined;
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

  // Método para formatear el tamaño del archivo
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Método para quitar un archivo específico
  removeSelectedFile(index: number): void {
    this.selectedDocs.splice(index, 1);
  }

  // Eventos de drag and drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.add('dragover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('dragover');

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFileSelection(files);
    }
  }

  // Método auxiliar para manejar la selección de archivos
  private handleFileSelection(files: FileList): void {
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === 'application/pdf'
    );
    this.selectedDocs.push(...pdfFiles);
  }

  // Modificar el método onDocsPick existente
  onDocsPick(event: any): void {
    const files = event.target.files;
    if (files) {
      this.handleFileSelection(files);
    }
  }

  // Modificar el método finish() para subir los documentos al finalizar
  finish(): void {
    // Primero subir los documentos si hay alguno seleccionado
    if (this.selectedDocs.length > 0) {
      this.uploadingDocs = true;
      this.uploadPickedDocs()
        .then(() => {
          // Después de subir los documentos, proceder con el registro
          this.proceedWithRegistration();
        })
        .catch((error) => {
          console.error('Error al subir documentos:', error);
          this.uploadingDocs = false;
          // Mostrar mensaje de error al usuario
        });
    } else {
      // Si no hay documentos, proceder directamente con el registro
      this.proceedWithRegistration();
    }
  }

  // Reemplazar el método proceedWithRegistration
  private proceedWithRegistration(): void {
    try {
      // Preparar los datos según el formato de la API
      const registroData: RegistroEmpresaRequest = this.prepararDatosRegistro();

      // Llamar a la API de registro
      this.empresaApiService.registrar(registroData).subscribe({
        next: (response) => {
          console.log('✅ Empresa registrada exitosamente:', response);

          // Guardar el social security en el formulario
          this.socialsecurity.patchValue({
            socialsecurity: response.social_security,
          });

          // Mostrar mensaje de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: `Empresa registrada con código: ${response.social_security}`,
            life: 5000,
          });

          // Mostrar el diálogo de éxito
          this.visible = true;

          // Opcional: enviar correo de confirmación
          this.enviarCorreoConfirmacion(response.social_security);
        },
        error: (error) => {
          console.error('❌ Error al registrar empresa:', error);

          let errorMessage = 'Error al registrar la empresa';

          if (error.status === 400) {
            errorMessage =
              'Datos de validación incorrectos. Verifique la información.';
          } else if (error.status === 409) {
            errorMessage = 'El email o RUC ya están registrados en el sistema.';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor. Intente nuevamente.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error de Registro',
            detail: errorMessage,
            life: 5000,
          });
        },
        complete: () => {
          this.uploadingDocs = false;
        },
      });
    } catch (error) {
      console.error('❌ Error al preparar datos:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al preparar los datos de registro',
        life: 3000,
      });
      this.uploadingDocs = false;
    }
  }

  // Nuevo método para preparar los datos según el formato de la API
  private prepararDatosRegistro(): RegistroEmpresaRequest {
    const basicValues = this.basicForm.value;
    const ubicacionValues = this.ubicacionForm.value;
    const representanteValues = this.representanteForm.value;
    const credencialesValues = this.credencialesForm.value;

    // Formatear fecha de fundación
    let foundedOn: string | undefined;
    if (basicValues.fechafundacion) {
      const fecha = new Date(basicValues.fechafundacion);
      foundedOn = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }

    // Formatear teléfono a formato E.164
    let phoneE164: string | undefined;
    if (representanteValues.telefono) {
      const phone =
        (representanteValues.telefono as string | number | null)?.toString() ||
        '';
      // Asumiendo que el teléfono ya incluye código de país o agregar lógica de formateo
      phoneE164 = phone.startsWith('+') ? phone : `+57${phone}`; // Ejemplo para Colombia
    }

    // Obtener URLs de documentos subidos
    const docUrls = this.uploadedDocs.map((doc) => doc.url);

    const registroData: RegistroEmpresaRequest = {
      company_name: basicValues.nombrecompleto || '',
      ruc: basicValues.ruc || '',
      email: credencialesValues.correo || '',
      password: credencialesValues.contrasenia || '',
      phone_e164: phoneE164,
      business_type_cod: this.mapearTipoNegocio(basicValues.tiponegocio),
      country_cod: this.mapearCodigoPais(basicValues.pais),
      province_cod: this.mapearCodigoProvincia(basicValues.provincia),
      municipality_cod: this.mapearCodigoMunicipio(basicValues.ciudad),
      founded_on: foundedOn,
      employee_count: basicValues.numeroempleados || undefined,
      fiscal_address: ubicacionValues.direccionfiscal || undefined,
      city: ubicacionValues.ciudad || undefined,
      postal_code: ubicacionValues.codigopostal || undefined,
      website: ubicacionValues.sitioweb || undefined,
      doc_urls: docUrls.length > 0 ? docUrls : undefined,
      role_id: 2, // Rol de empresa según la documentación
    };

    return registroData;
  }

  // Métodos auxiliares para mapear códigos
  private mapearTipoNegocio(
    tipoId: number | null | undefined
  ): string | undefined {
    if (!tipoId) return undefined;

    // Mapear según los tipos de negocio disponibles en tu sistema
    const tiposMap: Record<number, string> = {
      1: 'COMERCIO',
      2: 'SERVICIOS',
      3: 'MANUFACTURA',
      4: 'TECNOLOGIA',
      // Agregar más según tu catálogo
    };

    return tiposMap[tipoId];
  }

  private mapearCodigoPais(paisId: string | null | undefined): string {
    if (!paisId) return 'COL'; // Default Colombia

    // Mapear IDs internos a códigos ISO
    const paisesMap: Record<string, string> = {
      PE: 'COL', // Ejemplo: mapear Perú a Colombia
      MX: 'MEX',
      ES: 'ESP',
      CO: 'COL',
      // Agregar más según tu catálogo
    };

    return paisesMap[paisId] || paisId;
  }

  private mapearCodigoProvincia(
    provinciaId: string | null | undefined
  ): string {
    if (!provinciaId) return 'ANT'; // Default Antioquia

    // Mapear IDs internos a códigos de provincia
    const provinciasMap: Record<string, string> = {
      'PE-LIM': 'ANT', // Ejemplo
      'PE-CUS': 'BOG',
      'MX-JAL': 'JAL',
      // Agregar más según tu catálogo
    };

    return provinciasMap[provinciaId] || provinciaId;
  }

  private mapearCodigoMunicipio(
    municipioId: string | null | undefined
  ): string {
    if (!municipioId) return 'MED'; // Default Medellín

    // Mapear IDs internos a códigos de municipio
    const municipiosMap: Record<string, string> = {
      'PE-LIM-MIR': 'MED', // Ejemplo
      'PE-LIM-SIS': 'MED',
      'MX-JAL-GDL': 'GDL',
      // Agregar más según tu catálogo
    };

    return municipiosMap[municipioId] || municipioId;
  }

  // Método opcional para enviar correo de confirmación
  private enviarCorreoConfirmacion(socialSecurity: string): void {
    const representanteValues = this.representanteForm.value;
    const basicValues = this.basicForm.value;
    const to = representanteValues.correo || '';
    const subject = 'Empresa registrada exitosamente';
    const text = `
      <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="text-align:center; color:#333;">¡Empresa registrada exitosamente!</h2>
          <p style="font-size:16px; color:#555; text-align:center;">
            Estimado/a representante de <strong>${basicValues.nombrecompleto}</strong>,<br><br>
            Su empresa ha sido registrada exitosamente en nuestra plataforma.
          </p>
          <div style="background-color:#f8f9fa; padding:20px; border-radius:5px; margin:20px 0; text-align:center;">
            <h3 style="color:#333; margin:0;">Código de Seguridad Social</h3>
            <p style="font-size:24px; font-weight:bold; color:#007bff; margin:10px 0;">${socialSecurity}</p>
            <p style="font-size:14px; color:#666;">Guarde este código para futuras referencias</p>
          </div>
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
        console.log('✅ Correo de confirmación enviado:', res);
      },
      error: (err) => {
        console.error('❌ Error al enviar correo de confirmación:', err);
      },
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

  private cargarNegocio(): void {
    this.api.obtenerTipos('NEG').subscribe({
      next: (data: any[]) => (this.listNegocios = this.normalize(data)),
      error: () => (this.listNegocios = []),
    });
  }

  private cargarCargos(): void {
    this.api.obtenerTipos('CAR').subscribe({
      next: (data: any[]) => (this.listCargos = this.normalize(data)),
      error: () => (this.listCargos = []),
    });
  }
}

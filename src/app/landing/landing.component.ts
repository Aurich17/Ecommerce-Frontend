import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { Router, RouterModule } from '@angular/router';
// import { ApiService } from '../../services/api.services';
import { LandingService } from '../../services/landing.services';
import { EncabezadoResponse } from '../admin/landing/encabezado/domain/response/encabezado.response';
import { ImagekitClient } from '../../services/imagekit.service';
// import { getLandingAudienceResponse } from '../admin/landing/quienes/domain/quienes.response';
import { FormControl, FormGroup } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GalleriaModule } from 'primeng/galleria';
import { SliderDto } from '../admin/landing/slider/domain/slider.dto';
import { SupabaseService } from '../../services/supabase.service';

interface UploadItem {
  file: File;
  progress: number;
  url?: string;
  thumb?: string;
  error?: string;
}
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CarouselModule,
    AccordionModule,
    RouterModule,
    AvatarModule,
    DragDropModule,
    GalleriaModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  AVATAR_URL = 'https://cdn-icons-png.flaticon.com/512/12225/12225881.png';
  testimonios: {
    id: number;
    mensaje: string;
    nombre: string;
    avatar: string;
  }[] = [];
  slides: SliderDto[] = [];
  loadingSlides = false;
  uploads: UploadItem[] = [];
  showMobileMenu = false;
  encabezadoLanding?: EncabezadoResponse;
  quienesLanding?: any[] = [];
  comentariosLanding: any[] = [];
  preguntasLanding: any[] = [];
  caracteristicasLanding: any[] = [];
  funcionamientoLanding: any[] = [];
  footerLanding: any;

  constructor(
    private apiService: LandingService,
    private router: Router,
    private ik: ImagekitClient,
    private supa: SupabaseService
  ) {}
  ngOnInit() {
    this.cargarTestimonios();
    this.cargarSlider();
    this.footerLanding = new FormGroup({
      correo: new FormControl(''),
      telefono: new FormControl(''),
      titulo: new FormControl(''),
      descripcion: new FormControl(''),
      descripcionizq: new FormControl(''),
      copyright: new FormControl(''),
    });

    this.getEncabezado();
    this.getAudiencia();
    this.getTestimonials();
    this.getFAQ();
    this.getFeatures();
    this.getLandingHowItWork();
    this.getFooter();
  }

  cargarSlider() {
    this.loadingSlides = true;
    this.apiService
      .sliderList({ page: 1, limit: 50, status: 'true' })
      .subscribe({
        next: (res) => (this.slides = res?.data?.items ?? []),
        error: (err) => console.error('Error slider:', err),
        complete: () => (this.loadingSlides = false),
      });
  }
  empresas = [
    {
      nombre: 'Alexis Gamer',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s',
    },
    {
      nombre: 'Compañía de test',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s',
    },
    {
      nombre: 'Martin Cavero',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s',
    },
    {
      nombre: 'TechBridge Inc.',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s',
    },
    {
      nombre: 'London Market',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s',
    },
  ];
  async cargarTestimonios() {
    try {
      const rows = await this.supa.listPublicTestimonials();
      this.testimonios = rows.map((r) => ({
        id: r.id,
        mensaje: r.comment ?? '',
        nombre: r.client_name ?? 'Usuario',
        avatar: this.AVATAR_URL,
      }));
    } catch (e) {
      console.error(e);
    }
  }

  getEncabezado() {
    this.apiService.getLandingEncabezado().subscribe({
      next: (data) => {
        this.encabezadoLanding = {
          ...data,
          updated_at: new Date(data.updated_at),
        };
        if (data.logoUrl) {
          localStorage.setItem('logoUrl', data.logoUrl);
        }
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }

  getAudiencia() {
    this.apiService.getLandingAudience().subscribe({
      next: (data) => {
        console.log('data', data);
        this.quienesLanding = data.data.items;
      },
      error: (err: unknown) => console.error('Error fetching audiencia:', err),
    });
  }

  getTestimonials() {
    this.apiService.getLandingTestimonials().subscribe({
      next: (data) => {
        console.log('data', data);
        this.comentariosLanding = data.data.items.map((item) => {
          const fecha = new Date(item.created_at);
          const day = fecha.getDate().toString().padStart(2, '0');
          const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const year = fecha.getFullYear();

          return {
            ...item,
            creacion: `${day}/${month}/${year}`,
          };
        });
      },
      error: (err) => console.error('Error fetching testimonios:', err),
    });
  }

  getFAQ() {
    this.apiService.getLandingFAQ().subscribe({
      next: (data) => {
        console.log('data', data);
        this.preguntasLanding = data.data.items.map((item) => {
          const fecha = new Date(item.created_at);
          const day = fecha.getDate().toString().padStart(2, '0');
          const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const year = fecha.getFullYear();

          return {
            ...item,
            creacion: `${day}/${month}/${year}`,
          };
        });
      },
      error: (err) => console.error('Error fetching faq:', err),
    });
  }

  getFeatures() {
    this.apiService.getLandingFeatures().subscribe({
      next: (data) => {
        console.log('data', data);
        this.caracteristicasLanding = data.data.items.map((item) => {
          const fecha = new Date(item.created_at);
          const day = fecha.getDate().toString().padStart(2, '0');
          const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const year = fecha.getFullYear();

          return {
            ...item,
            creacion: `${day}/${month}/${year}`,
          };
        });
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }

  getLandingHowItWork() {
    this.apiService.getLandingHowItWork().subscribe({
      next: (data) => {
        console.log('data', data);
        this.funcionamientoLanding = data.data.items;
      },
      error: (err) => console.error('Error fetching howitwork:', err),
    });
  }

  getFooter() {
    this.apiService.getLandingFooter().subscribe({
      next: (data) => {
        // if (!this.footerLanding) return;
        this.footerLanding = {
          ...data,
          updated_at: new Date(data.data.updated_at),
        };
      },
      error: (err) => console.error('Error fetching footer:', err),
    });
  }

  async onPick(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;

    for (const file of files) {
      const item = { file, progress: 0 } as any;
      this.uploads.unshift(item);
      try {
        const res: any = await this.ik.uploadAndSave(file, '/projectA', [
          'angular',
        ]);
        // usa filePath para construir URL optimizada
        item.url = this.ik.url(
          { path: res.filePath },
          { w: 800, q: 80, f: 'auto' }
        );
        item.thumb = res.thumbnailUrl;
        item.progress = 100;
      } catch (err: any) {
        item.error = err?.message ?? 'Error subiendo';
      }
    }
    input.value = '';
  }

  go(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.showMobileMenu = false; // cierra el menú móvil al navegar
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.caracteristicasLanding,
      event.previousIndex,
      event.currentIndex
    );

    // TODO: si quieres persistir el orden, guarda this.caracteristicasLanding
    // en tu backend/NestJS aquí.
  }
}

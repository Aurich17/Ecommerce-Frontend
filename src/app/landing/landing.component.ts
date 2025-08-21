import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.services';
import { LandingService } from '../../services/landing.services';
import { EncabezadoResponse } from '../admin/landing/encabezado/domain/response/encabezado.response';
import { ImagekitClient } from '../../services/imagekit.service';
import { getLandingAudienceResponse } from '../admin/landing/quienes/domain/quienes.response';

type UploadItem = {
  file: File; progress: number; url?: string; thumb?: string; error?: string;
};
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ButtonModule, CardModule, CarouselModule, AccordionModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  uploads: UploadItem[] = [];
  showMobileMenu = false;
  encabezadoLanding?: EncabezadoResponse;
  quienesLanding?: any [] = []
  comentariosLanding: any[] = []
  preguntasLanding: any[] = []
  caracteristicasLanding: any[] = []
  funcionamientoLanding: any[] = []
  footerLanding?: any;

  constructor(private apiService: LandingService, private router: Router, private ik: ImagekitClient) { }
  ngOnInit() {
    this.getEncabezado()
    this.getAudiencia();
    this.getTestimonials();
    this.getFAQ();
    this.getFeatures();
    this.getLandingHowItWork();
    this.getFooter();
    
  }

  empresas = [
    {
      nombre: 'Alexis Gamer',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s'
    },
    {
      nombre: 'Compañía de test',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s'
    },
    {
      nombre: 'Martin Cavero',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s'
    },
    {
      nombre: 'TechBridge Inc.',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s'
    },
    {
      nombre: 'London Market',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s'
    }
  ];
  testimonios = [
    {
      nombre: 'Frank Escobedo',
      mensaje: 'Una plataforma de fácil uso.'
    },
    {
      nombre: 'Juan Esteban',
      mensaje: 'Productos buenos y económicos.'
    },
    {
      nombre: 'Juliana Pérez',
      mensaje: 'Pude comprar un excelente producto.'
    },
    {
      nombre: 'Carla Mendoza',
      mensaje: 'El sistema de pagos en cuotas me ayudó muchísimo.'
    },
    {
      nombre: 'Pedro Álvarez',
      mensaje: 'Rápido, confiable y muy intuitivo.'
    }
  ];

  getEncabezado() {
    this.apiService.getLandingEncabezado().subscribe({
      next: (data) => {
        this.encabezadoLanding = { ...data, updated_at: new Date(data.updated_at) };
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }

  getAudiencia() {
    this.apiService.getLandingAudience().subscribe({
      next: (data) => {
        console.log('data', data);
        this.quienesLanding = data.data.items
      },
      error: (err: unknown) => console.error('Error fetching audiencia:', err),
    });
  }

  getTestimonials() {
    this.apiService.getLandingTestimonials().subscribe({
      next: (data) => {
        console.log('data', data)
        this.comentariosLanding = data.data.items.map(item => {
          const fecha = new Date(item.created_at);
          const day = fecha.getDate().toString().padStart(2, '0');
          const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const year = fecha.getFullYear();

          return {
            ...item,
            creacion: `${day}/${month}/${year}`
          };
        })
      },
      error: (err) => console.error('Error fetching testimonios:', err),
    });
  }

  getFAQ() {
    this.apiService.getLandingFAQ().subscribe({
      next: (data) => {
        console.log('data', data)
        this.preguntasLanding = data.data.items.map(item => {
          const fecha = new Date(item.created_at);
          const day = fecha.getDate().toString().padStart(2, '0');
          const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const year = fecha.getFullYear();

          return {
            ...item,
            creacion: `${day}/${month}/${year}`
          };
        })
      },
      error: (err) => console.error('Error fetching faq:', err),
    });
  }

  getFeatures() {
    this.apiService.getLandingFeatures().subscribe({
      next: (data) => {
        console.log('data', data)
        this.caracteristicasLanding = data.data.items.map(item => {
          const fecha = new Date(item.created_at);
          const day = fecha.getDate().toString().padStart(2, '0');
          const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const year = fecha.getFullYear();

          return {
            ...item,
            creacion: `${day}/${month}/${year}`
          };
        })
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }

  getLandingHowItWork() {
    this.apiService.getLandingHowItWork().subscribe({
      next: (data) => {
        console.log('data', data)
        this.funcionamientoLanding = data.data.items
      },
      error: (err) => console.error('Error fetching howitwork:', err),
    });
  }

  getFooter() {
    this.apiService.getLandingFooter().subscribe({
      next: (data) => {
        this.footerLanding = { ...data, updated_at: new Date(data.data.updated_at) };
        console.log('footerLanding', this.footerLanding);
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
        const res: any = await this.ik.uploadAndSave(file, '/projectA', ['angular']);
        // usa filePath para construir URL optimizada
        item.url = this.ik.url({ path: res.filePath }, { w: 800, q: 80, f: 'auto' });
        item.thumb = res.thumbnailUrl;
        item.progress = 100;
      } catch (err: any) {
        item.error = err?.message ?? 'Error subiendo';
      }
    }
    input.value = '';
  }

  go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.showMobileMenu = false; // cierra el menú móvil al navegar
  }
}

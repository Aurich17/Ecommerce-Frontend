import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.services';
import { LandingService } from '../../services/landing.services';
import { EncabezadoResponse } from '../admin/landing/encabezado/domain/response/encabezado.response';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ButtonModule,CardModule,CarouselModule,AccordionModule,RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  showMobileMenu = false;
  encabezadoLanding?: EncabezadoResponse;

  constructor(private apiService: LandingService, private router: Router){}
  ngOnInit(){
    this.getEncabezado()
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
        console.log('Encabezado data:', data);
        // si quieres convertir la fecha a Date real:
        this.encabezadoLanding = { ...data, updated_at: new Date(data.updated_at) };
        console.log('Encabezado asignado:', this.encabezadoLanding);
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
}
}

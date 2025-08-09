import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ButtonModule,CardModule,CarouselModule,AccordionModule,RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  showMobileMenu = false;
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
}

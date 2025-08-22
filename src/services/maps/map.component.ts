import { Map, tileLayer, latLng, marker } from 'leaflet';
import { Component } from '@angular/core';
// import { tileLayer, latLng, Map, marker } from 'leaflet';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  template: `
    <div
      style="height:500px"
      leaflet
      [leafletOptions]="options"
      (leafletMapReady)="onMapReady($event)"
    ></div>
  `,
})
export class MapComponent {
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }),
    ],
    zoom: 6,
    center: latLng(40.4168, -3.7038),
  };

  private map!: Map;

  constructor(private http: HttpClient) {}

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('click', (e: any) => {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      marker([coords.lat, coords.lng]).addTo(this.map);

      this.http
        .post('http://localhost:3000/points', coords)
        .subscribe((data: any) => {
          alert('Datos del punto: ' + JSON.stringify(data));
        });
    });
  }
}

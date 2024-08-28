import { Component, OnInit } from '@angular/core';
import { Viaje } from '../../interfaces/viaje.interface';

@Component({
  selector: 'app-vistatrips',
  templateUrl: './vistatrips.component.html',
  styleUrls:['/src/assets/assets/css/now-ui-kit.css',
    './vistatrips.component.css','/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class VistatripsComponent implements OnInit{
  viajes: Viaje[] = [];
  
  ngOnInit(): void {
    // Recupera los datos del localStorage
    const viajesData = localStorage.getItem('viajes');
    if (viajesData) {
      this.viajes = JSON.parse(viajesData);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../../services/viaje.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class MainComponent implements OnInit {

  allTrips: any[] = []; 
  randomTrips: any[] = []; 

  constructor(private _viajeService: ViajeService) {}

  ngOnInit(): void {
    this._viajeService.getViajes().subscribe((viajes: any[]) => {
      this.randomTrips = this.obtenerViajesAleatorios(viajes, 4);
    });
  }

  obtenerViajesAleatorios(viajes: any[], cantidad: number): any[] {
  
    const viajesAleatorios = [];
    const copiaViajes = [...viajes];

    while (viajesAleatorios.length < cantidad && copiaViajes.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * copiaViajes.length);
      const viajeSeleccionado = copiaViajes.splice(indiceAleatorio, 1)[0];
      viajesAleatorios.push(viajeSeleccionado);
    }

    return viajesAleatorios;
  }
}
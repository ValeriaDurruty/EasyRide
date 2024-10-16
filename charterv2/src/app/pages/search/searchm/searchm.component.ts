import { Component, OnInit } from '@angular/core';
import { Parada } from '../../../interfaces/parada.interface';
import { ParadaService } from '../../../services/parada.service';
import { ViajeService } from '../../../services/viaje.service';
import { Router } from '@angular/router';
import { Viaje } from '../../../interfaces/viaje.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-searchm',
  templateUrl: './searchm.component.html',
  styleUrls: ['./searchm.component.css']
})
export class SearchmComponent implements OnInit {
  paradas: Parada[] = [];
  selectedOrigen: number | null = null;
  selectedDestino: number | null = null;
  selectedFecha: string = '';
  viajes: Viaje[] = [];

  constructor(
    private _paradaService: ParadaService,
    private _viajeService: ViajeService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._paradaService.getParadas().subscribe(data => {
      //console.log('Paradas recibidas:', data);
      this.paradas = data;
    }, error => {
      console.error('Error al obtener las paradas:', error);
    });
  }

  buscarViajes(): void {
      // Validación que todos los campos estén llenos
      if (!this.selectedFecha || !this.selectedOrigen || !this.selectedDestino) {
        this.mensaje('Por favor, ingrese todos los campos para realizar la búsqueda');
        return;
      }

      // Validación de fecha
      if (isNaN(Date.parse(this.selectedFecha)) || Date.parse(this.selectedFecha) < Date.now()) {
        this.mensaje('Por favor, ingrese una fecha válida');
        return;
      }
      
      const body = {
        fecha: this.selectedFecha,
        origen: this.selectedOrigen,
        destino: this.selectedDestino
      };

      //console.log('Datos enviados para la búsqueda:', body);
  
      this._viajeService.getBusquedaViajes(body).subscribe({
        next: (data: Viaje[] | string) => {
          //console.log('Viajes recibidos:', data);
          if (typeof data === 'string' && data === 'No hay viajes cargados') {
            this.viajes = []; // Si no hay viajes cargados, se asigna un array vacío
            this.mensaje('No hay viajes disponibles que cumplan con los criterios de búsqueda');
          } else if (Array.isArray(data)) {
            this.viajes = data; // Si es un array de viajes, se asigna a `viajes`
            // Almacenar los viajes en localStorage
            localStorage.setItem('viajes', JSON.stringify(this.viajes));
            localStorage.setItem('origenSeleccionado', this.selectedOrigen ? String(this.selectedOrigen) : ''); // Convierte a string
            localStorage.setItem('destinoSeleccionado', this.selectedDestino ? String(this.selectedDestino) : ''); // Convierte a string
            localStorage.setItem('fechaSeleccionada', this.selectedFecha ? String(this.selectedFecha) : ''); // Convierte a string
            // Redirigir a la vista de viajes
            this.router.navigate(['/Vista-Trips']);
          }
        },
        error: (error) => {
          console.error('Error al buscar viajes:', error);
        }
      });
    }

  mensaje(mensaje: string): void {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  
}

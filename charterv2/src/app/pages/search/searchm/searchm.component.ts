import { Component, OnInit } from '@angular/core';
import { Parada } from '../../../interfaces/parada.interface';
import { ParadaService } from '../../../services/parada.service';
import { ViajeService } from '../../../services/viaje.service';
import { Router } from '@angular/router';
import { Viaje } from '../../../interfaces/viaje.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProvinciaService } from '../../../services/provincia.service';
import { LocalidadService } from '../../../services/localidad.service';
import { Localidad } from '../../../interfaces/localidad.interface';
import { Provincia } from '../../../interfaces/provincia.interface';

@Component({
  selector: 'app-searchm',
  templateUrl: './searchm.component.html',
  styleUrls: ['./searchm.component.css']
})
export class SearchmComponent implements OnInit {
  paradasOrigen: Parada[] = [];
  paradasDestino:Parada[] =[];
  selectedOrigen: number | null = null;
  selectedDestino: number | null = null;
  localidadesOrigen: any[] = []; 
  localidadesDestino:Localidad[]=[];
  provinciasOrigen: Provincia[] = []; 
  provinciasDestino:Provincia[]= [];
  selectedOrigenProvincia: number = 0;
  selectedOrigenLocalidad: number = 0;
  selectedDestinoProvincia: number = 0;
  selectedDestinoLocalidad: number = 0;
  selectedFecha: string = '';
  viajes: Viaje[] = [];

  constructor(
    private _paradaService: ParadaService,
    private _viajeService: ViajeService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _provinciaService:ProvinciaService,
    private _localidadService:LocalidadService
  ) { }

  ngOnInit(): void {
    this.cargarProvincias();
  }


  cargarProvincias(): void {
    this._provinciaService.getProvincias().subscribe(data => {
      this.provinciasDestino = data;
      this.provinciasOrigen=data;
    }, error => {
      console.error('Error al obtener provincias:', error);
    });
  }

  cargarLocalidades(provinciaId: number): void {
    this._localidadService.getLocalidadesPorProvincia(provinciaId).subscribe(data => {
      this.localidadesOrigen = data;
      this.selectedOrigenLocalidad = 0; // Reinicia localidad al cambiar provincia
      this.paradasOrigen = []; // Resetea paradas al cambiar provincia
    }, error => {
      console.error('Error al obtener localidades:', error);
    });
  }

  cargarLocalidadesDestino(provinciaId: number): void {
    this._localidadService.getLocalidadesPorProvincia(provinciaId).subscribe(data => {
      this.localidadesDestino = data;
      this.selectedDestinoLocalidad = 0; // Reinicia localidad al cambiar provincia
      this.paradasDestino = []; // Resetea paradas al cambiar provincia
    }, error => {
      console.error('Error al obtener localidades:', error);
    });
  }

  cargarParadas(localidadId: number): void {
    this._paradaService.getParadasXLocalidad(localidadId).subscribe(data => {
      this.paradasOrigen = data;
      this.selectedOrigen = null; // Reinicia parada al cambiar localidad
    }, error => {
      console.error('Error al obtener paradas:', error);
    });
  }

  
  cargarParadasDestino(localidadId: number): void {
    this._paradaService.getParadasXLocalidad(localidadId).subscribe(data => {
      this.paradasDestino = data;
      this.selectedDestino = null; // Reinicia parada al cambiar localidad
    }, error => {
      console.error('Error al obtener paradas:', error);
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
        fecha_salida: this.selectedFecha,
        origen: this.selectedOrigen,
        destino: this.selectedDestino
      };

      console.log('Datos enviados para la búsqueda:', body);
  
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeocodingService } from '../../services/geocoding.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalshComponent } from '../modalsh/modalsh.component';
import { LocalidadService } from '../../services/localidad.service';
import { ProvinciaService } from '../../services/provincia.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var mapboxgl: any;
@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponentComponent {
  address: string = '';
  addressDetails: any = {};
  coordinates: string = '';
  results: any[] = [];
  provincias: any[] = []; 
  localidades: any[] = []; 

  @Output() coordinatesChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() provincia: string = '';
  @Input() localidad: string = '';
  constructor(private geocodingService: GeocodingService, public dialog: MatDialog,
    private _localidadesService: LocalidadService, // Inyección del servicio de localidades
    private _provinciasService: ProvinciaService, // I
    private snackBar: MatSnackBar
  ) { this.loadProvincias();
    this.loadLocalidades();}

    getCoordinates() {
      const address = this.address; // Dirección ingresada por el usuario
      const provinciaNombre = this.getProvinciaNombre(this.provincia); // Nombre de la provincia
      const localidadNombre = this.getLocalidadNombre(this.localidad); // Nombre de la localidad
  
      //console.log('Provincia Nombre:', provinciaNombre); // Log para verificar
      //console.log('Localidad Nombre:', localidadNombre); // Log para verificar
  
      this.geocodingService.getCoordinates(address, provinciaNombre, localidadNombre).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.results = data; // Maneja los resultados de la búsqueda
            this.openResultsModal(); // Abre el modal con los resultados, si es necesario
          } else {
            this.mensaje('No se encontraron coordenadas.');
            console.error('No se encontraron coordenadas.');
          }
        },
        (error) => {
          console.error('Error al obtener las coordenadas:', error);
        }
      );
    }

loadProvincias() {
  this._provinciasService.getProvincias().subscribe((data: any[]) => {
    this.provincias = data; // Asigna los datos a la lista de provincias
    //console.log('Provincias cargadas:', this.provincias); // Log para verificar
  }, error => {
    console.error('Error al cargar provincias:', error);
  });
}

loadLocalidades() {
  this._localidadesService.getLocalidades().subscribe((data: any[]) => {
    this.localidades = data; // Asigna los datos a la lista de localidades
    //console.log('Localidades cargadas:', this.localidades); // Log para verificar
  }, error => {
    console.error('Error al cargar localidades:', error);
  });
}
getProvinciaNombre(provinciaId: string) {
  const id = parseInt(provinciaId, 10); // Convierte provinciaId a número
  //console.log('Buscando provincia con ID:', id);
  const provincia = this.provincias.find(p => p.PK_Provincia === id);
  //console.log('Provincia encontrada:', provincia);
  return provincia ? provincia.nombre : '';
}

getLocalidadNombre(localidadId: string) {
  const id = parseInt(localidadId, 10); // Convierte localidadId a número
  //console.log('Buscando localidad con ID:', id);
  const localidad = this.localidades.find(l => l.PK_Localidad === id);
  //console.log('Localidad encontrada:', localidad);
  return localidad ? localidad.nombre : '';
}


  openResultsModal() {
    const dialogRef = this.dialog.open(ModalshComponent, {
      data: {
        tipoOperacion: 'resultados', // Para identificar que es el modal de resultados
        results: this.results // Pasa los resultados de búsqueda
      }
    });

    dialogRef.componentInstance.select.subscribe((selectedResult) => {
      this.selectLocation(selectedResult);
    });
  }

  selectLocation(result: any) {
    const lat = result.lat;
    const lon = result.lon;
    this.coordinates = `${lat}, ${lon}`;
    this.getAddress(lat, lon); // Obtiene detalles de la dirección
  }

  getAddress(lat: number, lon: number) {
    this.geocodingService.getAddressFromCoordinates(lat, lon).subscribe(
      (data) => {
        if (data && data.address) {
          this.addressDetails = {
            road: data.address.road || 'No especificado',
            suburb: data.address.suburb || 'No especificado',
            city: data.address.city || data.address.town || 'No especificado',
            state: data.address.state || 'No especificado',
            postcode: data.address.postcode || 'No especificado',
            country: data.address.country || 'No especificado'
          };

          // Abre el segundo modal aquí con los detalles de la dirección
          this.openSecondModal();
        } else {
          console.error('No se encontró la dirección.');
        }
      },
      (error) => {
        console.error('Error al obtener la dirección:', error);
      }
    );
  }

  openSecondModal() {
    const dialogRef = this.dialog.open(ModalshComponent, {
      data: {
        tipoOperacion: 'modal2', // Para el modal de dirección
        direccion: this.addressDetails, // Pasa los detalles de la dirección
        coordenadas: this.coordinates
      }
    });

    dialogRef.componentInstance.confirm.subscribe(result => {
      //console.log('Datos confirmados del Modal de Dirección:', result);
      this.coordinatesChange.emit(this.coordinates);
    });
  }

  mensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }
}
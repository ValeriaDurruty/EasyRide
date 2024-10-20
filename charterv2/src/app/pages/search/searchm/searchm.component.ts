import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParadaService } from '../../../services/parada.service';
import { ProvinciaService } from '../../../services/provincia.service';
import { LocalidadService } from '../../../services/localidad.service';
import { ViajeService } from '../../../services/viaje.service';
import { Provincia } from '../../../interfaces/provincia.interface';
import { Localidad } from '../../../interfaces/localidad.interface';
import { Parada } from '../../../interfaces/parada.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-searchm',
  templateUrl: './searchm.component.html',
  styleUrls: ['./searchm.component.css']
})
export class SearchmComponent implements OnInit {
  provinciasOrigen: Provincia[] = [];
  localidadesOrigen: Localidad[] = [];
  paradasOrigen: Parada[] = [];

  provinciasDestino: Provincia[] = [];
  localidadesDestino: Localidad[] = [];
  paradasDestino: Parada[] = [];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _paradaService: ParadaService,
    private _viajeService: ViajeService,
    private _provinciaService: ProvinciaService,
    private _localidadService: LocalidadService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      provinciaOrigen: [null, Validators.required],
      localidadOrigen: [null, Validators.required],
      paradaOrigen: [null, Validators.required],
      provinciaDestino: [null, Validators.required],
      localidadDestino: [null, Validators.required],
      paradaDestino: [null, Validators.required],
      fecha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Inicializamos las provincias al cargar la página
    this._provinciaService.getProvincias().subscribe(data => {
      this.provinciasOrigen = data;
      this.provinciasDestino = data;
    }, error => {
      console.error('Error al obtener las provincias:', error);
    });
  }

  // Se llama cuando cambia la provincia
  onSelectProvincia(tipo: 'origen' | 'destino'): void {
    const provinciaSeleccionada = this.form.get(`provincia${this.capitalize(tipo)}`)?.value;

    if (provinciaSeleccionada) {
      this._localidadService.getLocalidadesPorProvincia(provinciaSeleccionada).subscribe(data => {
        if (tipo === 'origen') {
          this.localidadesOrigen = data;
          this.paradasOrigen = [];
          this.form.get('localidadOrigen')?.reset();
          this.form.get('paradaOrigen')?.reset();
        } else {
          this.localidadesDestino = data;
          this.paradasDestino = [];
          this.form.get('localidadDestino')?.reset();
          this.form.get('paradaDestino')?.reset();
        }
      }, error => {
        console.error('Error al obtener las localidades:', error);
      });
    }
  }

// Se llama cuando cambia la localidad
onSelectLocalidad(tipo: 'origen' | 'destino'): void {
  const localidadSeleccionada = this.form.get(`localidad${this.capitalize(tipo)}`)?.value;

  if (localidadSeleccionada) {
    this._paradaService.getParadasxLocalidad(localidadSeleccionada).subscribe(data => {
      // Verificamos si data es un array
      if (Array.isArray(data) && data.length > 0) {
        // Asignar paradas si existen
        if (tipo === 'origen') {
          this.paradasOrigen = data;
        } else {
          this.paradasDestino = data;
        }
      } else if (typeof data === 'string') {
        // Si data es un string, mostrar mensaje y establecer array vacío
        this.mensaje(data);
        if (tipo === 'origen') {
          this.paradasOrigen = []; // Asignar array vacío
        } else {
          this.paradasDestino = []; // Asignar array vacío
        }
      }
      
      // Reiniciar el campo de la parada para que se seleccione nuevamente
      if (tipo === 'origen') {
        this.form.get('paradaOrigen')?.reset();
      } else {
        this.form.get('paradaDestino')?.reset();
      }
    }, error => {
      console.error('Error al obtener las paradas:', error);
      this.mensaje('Error al obtener las paradas.'); // Mensaje en caso de error
      // Establecer arrays vacíos en caso de error
      if (tipo === 'origen') {
        this.paradasOrigen = [];
      } else {
        this.paradasDestino = [];
      }
    });
  }
}

  // Capitaliza la primera letra para facilitar el uso de los nombres de los campos
  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  buscarViajes(): void {
    if (this.form.invalid) {
      this.mensaje('Por favor, complete todos los campos antes de realizar la búsqueda');
      return;
    }

    const { provinciaOrigen, localidadOrigen, paradaOrigen, provinciaDestino, localidadDestino, paradaDestino, fecha } = this.form.value;

    const body = {
      fecha_salida: fecha,
      origen: paradaOrigen,
      destino: paradaDestino
    };

    this._viajeService.getBusquedaViajes(body).subscribe({
      next: (data: any) => {
        if (typeof data === 'string' && data === 'No hay viajes cargados') {
          console.log(data);
          this.mensaje('No hay viajes disponibles que cumplan con los criterios de búsqueda');
        } else {
          console.log('Viajes encontrados:', data);
          localStorage.setItem('viajes', JSON.stringify(data));
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
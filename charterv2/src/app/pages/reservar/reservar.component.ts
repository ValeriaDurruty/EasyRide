import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Parada } from '../../interfaces/parada.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViajeService } from '../../services/viaje.service';
import { Viaje } from '../../interfaces/viaje.interface';
import { Charter } from '../../interfaces/charter.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { ReservaService } from '../../services/reserva.service';
import { SessionService } from '../../services/session.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.component.html',
  styleUrls: [
    '/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css',
    './reservar.component.css'
  ]
})

export class ReservarComponent implements OnInit, OnDestroy {

  paradasSeleccionadas: ViajeParada[] = [];
  parada: [] = [];
  form: FormGroup;
  idViaje: number | null = null;
  charters: any[] = [];
  paradas: Parada[] = [];
  selectedCharter: Charter | null = null;
  public botonReservarPresionado: boolean = false;
  private sessionSubscription: Subscription = new Subscription();  

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _viajeService: ViajeService,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private _reservaService: ReservaService,
    private ngZone: NgZone,
    private _sessionService: SessionService,
    private location: Location
  ) {
    this.form = this.fb.group({
      horario_salida: [''],
      horario_llegada: [''],
      fecha_salida: [''],
      fecha_llegada:[''],
      precio: [''],
      cupo: [''],
      patente_charter: [''],
      modelo_charter: [''],
      marca_charter: [''],
      empresa_nombre: [''],
    });
  }

  ngOnInit(): void {
    // Suscripción al parámetro 'id' de la ruta
    this._route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.idViaje = id;
        //console.log(this.idViaje);
        this.obtenerViajeXid(id);
      } else {
        console.error('ID no válido');
      }
    });
  }

  ngOnDestroy(): void {
    // Evitar pérdidas de memoria desuscribiéndose de la suscripción
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }

  obtenerViajeXid(id: number): void {
    this._viajeService.getViajeXid(id).subscribe(
      response => {
        console.log('Respuesta recibida del servidor:', response); // Log del viaje recibido
        if (Array.isArray(response) && response.length > 0) {
          const viaje: Viaje = response[0];
  
          // Mostrar detalles del viaje recibido
          console.log('Viaje procesado:', viaje);
  
          let fechaSalida: Date;
          if (typeof viaje.fecha_salida === 'string') {
            fechaSalida = this.convertirCadenaADate(viaje.fecha_salida);
          } else {
            fechaSalida = new Date(viaje.fecha_salida);
          }
  
          let fechaLlegada: Date;
          if (typeof viaje.fecha_llegada === 'string') {
            fechaLlegada = this.convertirCadenaADate(viaje.fecha_llegada);
          } else {
            fechaLlegada = new Date(viaje.fecha_llegada);
          }
  
          const fechaSalidaConvertida = this.convertirFechaAFormatoInput(fechaSalida);
          const fechaLlegadaConvertida = this.convertirFechaAFormatoInput(fechaLlegada);
  
          // Actualizar el formulario con los datos del viaje
          this.form.patchValue({
            horario_salida: viaje.horario_salida,
            horario_llegada: viaje.horario_llegada,
            fecha_salida: fechaSalidaConvertida,
            fecha_llegada: fechaLlegadaConvertida,
            precio: viaje.precio,
            cupo: viaje.cupo,
            empresa_nombre: viaje.empresa,
            patente_charter: viaje.patente,
            marca_charter: viaje.marca,
            modelo_charter: viaje.modelo
          });
  
          // Log de las fechas convertidas
          console.log('Fecha de salida convertida:', fechaSalidaConvertida);
          console.log('Fecha de llegada convertida:', fechaLlegadaConvertida);
  
          // Log del estado del formulario después de patchValue
          console.log('Estado del formulario después de patchValue:', this.form.value);
  
          // Asignar paradas si están presentes
          if (typeof viaje.paradas === 'string') {
            this.paradasSeleccionadas = this.parseParadas(viaje.paradas);
  
            // Log de las paradas procesadas
            console.log('Paradas procesadas:', this.paradasSeleccionadas);
          } else {
            console.log('No se encontraron paradas en el viaje.');
            this.paradasSeleccionadas = [];
          }
        } else {
          console.error('Respuesta inesperada del servidor');
        }
      },
      error => {
        console.error('Error al obtener el viaje:', error);
        this.mensaje('Error al obtener el viaje');
      }
    );
  }
  
  
  // PARADAS
  parseParadas(paradasStr: string): ViajeParada[] {
    const paradasArray = paradasStr.split(';');
  
    return paradasArray.map(paradaStr => {
      // Eliminar espacios en blanco antes y después de la cadena
      const trimmedParadaStr = paradaStr.trim();
  
      // Expresión regular para capturar la información de las paradas
      const matches = trimmedParadaStr.match(/PK_Viaje_parada:\s*(\d+),\s*PK_Parada:\s*(\d+),\s*Orden:\s*(\d+),\s*Parada:\s*([^,]+),\s*Localidad:\s*([^,]+),\s*Provincia:\s*([^,]+),\s*Coordenadas:\s*([\-\d.]+),\s*([\-\d.]+)/);
  
      if (matches) {
        const paradaData: ViajeParada = {
          PK_Viaje_Parada: Number(matches[1]),
          FK_Parada: Number(matches[2]),
          orden: Number(matches[3]),
          parada: matches[4].trim(),
          coordenadas: `${matches[7]},${matches[8]}`, // Juntamos latitud y longitud
          FK_Viaje: 0 // Asigna un valor adecuado para FK_Viaje si lo tienes
        };
  
        console.log('Parada procesada:', paradaData); // Log de cada parada procesada
        return paradaData;
      }
  
      return null; // Si no hay coincidencias, devolvemos null
    }).filter(parada => parada !== null) as ViajeParada[]; // Filtramos los nulos
  }
  

  //CHARTER
  onCharterChange(event: Event): void {
    const selectedCharterId = (event.target as HTMLSelectElement).value;
    this.selectedCharter = this.charters.find(charter => charter.PK_Charter.toString() === selectedCharterId) || null;
  }

  //FECHA
  convertirFechaAFormatoInput(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
    const dia = String(fecha.getDate()).padStart(2, '0');
    
    const fechaConvertida = `${anio}-${mes}-${dia}`;
    //console.log(`Fecha convertida a formato input: ${fechaConvertida}`);
    return fechaConvertida;
  }

  convertirCadenaADate(fechaStr: string): Date {
    const partes = fechaStr.split('-');
    if (partes.length === 3) {
      const dia = Number(partes[0]);
      const mes = Number(partes[1]) - 1; // Los meses en JavaScript son de 0 a 11
      const anio = Number(partes[2]);
    
      const fecha = new Date(anio, mes, dia);
      //console.log(`Fecha convertida a Date: ${fecha}`);
      return fecha;
    }
    //console.error('Formato de fecha incorrecto:', fechaStr);
    return new Date(); // Retorna una fecha por defecto en caso de error
  }

  navegar() {
    const previousUrl = this._sessionService.getPreviousUrl(); // Obtener la URL previa
  
    // Verificar si el usuario está autenticado
    if (this._userService.isAuthenticated()) {
      // Si la URL previa empieza con /LogIn
      if (previousUrl?.startsWith('/LogIn')) {
        // Aquí puedes almacenar la URL anterior antes de que se acceda a LogIn
        const lastValidUrl = this._sessionService.getLastValidUrl(); // Método que debes implementar en SessionService
        this._router.navigate([lastValidUrl || '/']); // Redirigir a la última URL válida o a la página principal
      } else {
        this.location.back(); // Redirigir a la página anterior
      }
    } else {
      // Si no está autenticado, redirigir al login
      this._router.navigate(['/Login']);
    }
  }
  
  //MENSAJES DE NOTIFICACION
  mensaje(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar-error']
    });
  }

  reservar(): void {
    this.botonReservarPresionado = true;
    //console.log('Llamando a guardarReserva desde reservar()');
    this.guardarReserva();
  }

  guardarReserva(): void {
    console.log('Iniciando guardarReserva');
    
    if (!this.botonReservarPresionado) {
      console.error('El botón de reserva no ha sido presionado.');
      return;
    }

    if (this.form.valid) {
      console.log('Formulario válido, obteniendo usuario actual...');
      // Guardar la suscripción para poder desuscribirse más tarde
      this.sessionSubscription.add(this._userService.getCurrentUser().subscribe(usuario => {
        //console.log('Usuario obtenido:', usuario);
        this.ngZone.run(() => {
          if (usuario) {
            const ROLES_NO_PERMITIDOS = [1, 2];
            if (ROLES_NO_PERMITIDOS.includes(usuario.FK_Rol)) {
              this.mensaje('No tienes permiso para realizar reservas.');
              return;
            }

            if (usuario.PK_Usuario && this.idViaje !== null) {
              console.log('Datos válidos para la reserva:', {
                PK_Usuario: usuario.PK_Usuario,
                PK_Viaje: this.idViaje
              });

              const reservaData = {
                PK_Usuario: usuario.PK_Usuario,
                PK_Viaje: this.idViaje
              };

              this._reservaService.addReserva(reservaData).subscribe(
                () => {
                  this.mensaje('La reserva fue realizada con éxito');
                  this._router.navigate(['/V-cliente']);
                },
                error => {
                  console.error('Error al guardar la reserva:', error);
                  this.mensaje('Error al guardar la reserva');
                }
              );
            } else {
              console.error('Usuario o ID de viaje inválidos.');
              this.mensaje('No se puede realizar la reserva.');
            }
          } else {
            console.error('Usuario no encontrado.');
            this.mensaje('No se pudo obtener el usuario.');
          }
        });
      }));
    } else {
      console.error('Formulario inválido.');
      this.mensaje('Formulario inválido.');
    }
  }
}

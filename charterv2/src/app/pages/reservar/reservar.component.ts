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
    private _sessionService: SessionService
  ) {
    this.form = this.fb.group({
      horario_salida: [''],
      horario_llegada: [''],
      fecha: [''],
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
        console.log(this.idViaje);
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
        if (Array.isArray(response) && response.length > 0) {
          const viaje: Viaje = response[0];
          let fechaDate: Date;
          if (typeof viaje.fecha === 'string') {
            fechaDate = this.convertirCadenaADate(viaje.fecha);
          } else {
            fechaDate = new Date(viaje.fecha);
          }
          const fechaConvertida = this.convertirFechaAFormatoInput(fechaDate);
          this.form.patchValue({
            horario_salida: viaje.horario_salida,
            horario_llegada: viaje.horario_llegada,
            fecha: fechaConvertida,
            precio: viaje.precio,
            cupo: viaje.cupo,
            empresa_nombre: viaje.empresa,
            patente_charter: viaje.patente,
            marca_charter: viaje.marca,
            modelo_charter: viaje.modelo
          });

          // Asignar paradas si están presentes
          this.paradasSeleccionadas = typeof viaje.paradas === 'string'
            ? this.parseParadas(viaje.paradas)
            : [];
        } else {
          console.error('Respuesta inesperada del servidor');
        }
      },
      error => {
        console.error('Error al obtener el viaje:', error);
        this.mensajeError('Error al obtener el viaje');
      }
    );
  }

  //PARADAS
  parseParadas(paradasString: string): ViajeParada[] {
    const paradasArray = paradasString.split(';').map(paradaString => {
      const partes = paradaString.split(',').map(part => part.trim());
      
      // Asegúrate de que todas las propiedades necesarias están presentes
      const paradaObj: ViajeParada = {
        PK_Viaje_Parada: Number(partes[0].split(':')[1]),
        FK_Parada: Number(partes[1].split(':')[1]),
        orden: Number(partes[2].split(':')[1]),
        parada: partes[3].split(':')[1].trim(),
        FK_Viaje: 0 // Asigna un valor adecuado para FK_Viaje si lo tienes
      };
      console.log('Parada procesada:', paradaObj); // Verifica que el objeto sea correcto
      return paradaObj;
    });
    return paradasArray;
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
    console.log(`Fecha convertida a formato input: ${fechaConvertida}`);
    return fechaConvertida;
  }

  convertirCadenaADate(fechaStr: string): Date {
    const partes = fechaStr.split('-');
    if (partes.length === 3) {
      const dia = Number(partes[0]);
      const mes = Number(partes[1]) - 1; // Los meses en JavaScript son de 0 a 11
      const anio = Number(partes[2]);
    
      const fecha = new Date(anio, mes, dia);
      console.log(`Fecha convertida a Date: ${fecha}`);
      return fecha;
    }
    console.error('Formato de fecha incorrecto:', fechaStr);
    return new Date(); // Retorna una fecha por defecto en caso de error
  }

  //MENSAJES DE NOTIFICACION
  mensajeExito() {
    this._snackBar.open('La reserva fue realizada con éxito', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }

  mensajeError(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar-error']
    });
  }

  reservar(): void {
    this.botonReservarPresionado = true;
    console.log('Llamando a guardarReserva desde reservar()');
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
        console.log('Usuario obtenido:', usuario);
        this.ngZone.run(() => {
          if (usuario) {
            const ROLES_NO_PERMITIDOS = [1, 2];
            if (ROLES_NO_PERMITIDOS.includes(usuario.FK_Rol)) {
              this.mensajeError('No tienes permiso para realizar reservas.');
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
                  this.mensajeExito();
                  this._router.navigate(['/V-cliente']);
                },
                error => {
                  console.error('Error al guardar la reserva:', error);
                  this.mensajeError('Error al guardar la reserva');
                }
              );
            } else {
              console.error('Usuario o ID de viaje inválidos.');
              this.mensajeError('No se puede realizar la reserva.');
            }
          } else {
            console.error('Usuario no encontrado.');
            this.mensajeError('No se pudo obtener el usuario.');
          }
        });
      }));
    } else {
      console.error('Formulario inválido.');
      this.mensajeError('Formulario inválido.');
    }
  }
}

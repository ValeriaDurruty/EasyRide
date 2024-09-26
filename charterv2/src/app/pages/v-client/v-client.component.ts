import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDataService } from '../../shared/user-data.service';
import { Usuario } from '../../interfaces/user.interface';
import { ReservaService } from '../../services/reserva.service';
import { ConfirmationService } from '../../services/dialog.confirm';
import { Subscription } from 'rxjs';
import { ReservaPasajero } from '../../interfaces/reservaPasajero.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { Parada } from '../../interfaces/parada.interface';

@Component({
  selector: 'app-v-client',
  templateUrl: './v-client.component.html',
  styleUrls: ['/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css','./v-client.component.css']
})
export class VClientComponent implements OnInit {
  listReservasFuturas: ReservaPasajero[] = [];
  listReservasPasadas: ReservaPasajero[] = [];
  listParadas: Parada[] = [];
  loading: boolean = false; // Variable para mostrar la barra de carga
  private userSubscription: Subscription | null = null;
  private logoutSubscription: Subscription | null = null;
  currentTab: string = 'tab1'; // Pestaña activa por defecto
  user: Usuario | null = null;
  PK_Usuario: number = 0;
  selectedReserva: any = null; 
  showModal: boolean = false;  // Controla la visibilidad del modal
  private reservasSubscription: Subscription | null = null;


  constructor(
    private userDataService: UserDataService,
    private _reservaService: ReservaService,
    private _dialog: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getUsuarioCompartido();
  }

  showTab(tabId: string) {
    this.currentTab = tabId;
  }

  getUsuarioCompartido() {
    this.userDataService.currentUser$.subscribe(user => {
      if (user) {
        console.log('Usuario recibido:', user);
        this.user = user;
        this.PK_Usuario = this.user.PK_Usuario;
        console.log('PK de usuario:', this.PK_Usuario);
  
        // Llama a getReservasPasajero solo después de asignar PK_Usuario
        this.getReservasFuturasPasajero(this.PK_Usuario);
        this.getReservasPasadasPasajero(this.PK_Usuario);
      } else {
        console.log('No se recibió ningún usuario');
      }
    });
  }

 getReservasFuturasPasajero(PK_Usuario: number): void {
    this.loading = true;
    this._reservaService.getReservasFuturasPasajero(PK_Usuario).subscribe(
      data => {
        console.log('Datos recibidos:', data);
        // Verifica que `data` sea un array
        if (Array.isArray(data)) {
          this.listReservasFuturas = data.map(reserva => ({
            ...reserva,
            paradas: typeof reserva.paradas === 'string' ? this.parseParadas(reserva.paradas) : []
          }));
        } else {
          console.error('La respuesta no es un array:', data);
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error('Error al obtener las reservas:', error);
        this.mensaje('Error al obtener las reservas');
      }
    );
  }

  getReservasPasadasPasajero(PK_Usuario: number): void {
    this.loading = true;
    this._reservaService.getReservasPasadasPasajero(PK_Usuario).subscribe(
      data => {
        console.log('Datos recibidos:', data);
        // Verifica que `data` sea un array
        if (Array.isArray(data)) {
          this.listReservasPasadas = data.map(reserva => ({
            ...reserva,
            paradas: typeof reserva.paradas === 'string' ? this.parseParadas(reserva.paradas) : []
          }));
        } else {
          console.error('La respuesta no es un array:', data);
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error('Error al obtener las reservas:', error);
        this.mensaje('Error al obtener las reservas');
      }
    );
  }


  parseParadas(paradasStr: string): ViajeParada[] {
    return paradasStr.split(';').map(paradaStr => {
      const matches = paradaStr.match(/Orden: (\d+), Parada: ([^,]+)/);
      if (matches) {
        return {
          orden: parseInt(matches[1], 10),
          parada: matches[2]
        } as ViajeParada;
      }
      return null;
    }).filter(parada => parada !== null) as ViajeParada[];
  }
  

  confirmCancelarReserva(id: number): void {
    this._dialog.confirm('¿Seguro que quieres cancelar la reserva?').subscribe(result => {
      if (result) {
        this.cancelarReserva(id);
      }
    });
  }

  cancelarReserva(id: number): void {
    this.loading = true;
    this._reservaService.cancelarReserva(id).subscribe(
      () => {
        this.getReservasFuturasPasajero(this.PK_Usuario);
        this.mensaje('Reserva cancelada con éxito');
      },
      error => {
        this.loading = false;
        console.error('Error al cancelar la reserva:', error);
        this.mensaje('Error al cancelar la reserva');
      }
    );
  }

  selectedTicketData: any = null; // Datos del ticket seleccionado

  mostrarTicket(idReserva: number) {
    console.log('Buscando ticket con ID:', idReserva);
    const reserva = this.listReservasFuturas.find(res => res.PK_Reserva === idReserva);
    if (reserva) {
      console.log('Reserva encontrada:', reserva);
      this.selectedTicketData = reserva;
      this.showModal = true;  // Mostrar el modal
    } else {
      console.log('No se encontró reserva con ID:', idReserva);
    }
  }

  handleClose() {
    this.showModal = false;  // Ocultar el modal
  }

  mensaje(mensaje: string): void {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  ngOnDestroy() {
    // Cancelar las suscripciones para evitar fugas de memoria
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
    if (this.reservasSubscription) {
      this.reservasSubscription.unsubscribe();
    }
  }
}
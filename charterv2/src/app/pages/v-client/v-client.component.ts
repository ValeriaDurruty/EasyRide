import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDataService } from '../../shared/user-data.service';
import { Usuario } from '../../interfaces/user.interface';
import { ReservaService } from '../../services/reserva.service';
import { EmpresaService } from '../../services/empresa.service';
import { ConfirmationService } from '../../services/dialog.confirm';
import { Subscription } from 'rxjs';
import { ReservaPasajero } from '../../interfaces/reservaPasajero.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { Parada } from '../../interfaces/parada.interface';
import { MatDialog } from '@angular/material/dialog';
import { ModalcontactEmpresaComponent } from '../../components/modal-contact-empresa/modal-contact-empresa.component';
import { ModalPagoComponent } from '../../components/modal-pago/modal-pago.component';
import { ViajeService } from '../../services/viaje.service';
import { Viaje } from '../../interfaces/viaje.interface';

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
  currentTab: string = 'tab1'; // Pestaña activa por defecto
  user: Usuario | null = null;
  PK_Usuario: number = 0;
  selectedReserva: any = null; 
  showModal: boolean = false;  // Controla la visibilidad del modal
  selectedTicketData: any = null; // Datos del ticket seleccionado
  selectedEmpresaData: any = null; // Datos de la empresa seleccionada
  selectedPagoData: any = null;
  private reservasSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;
  private logoutSubscription: Subscription | null = null;

  constructor(
    private userDataService: UserDataService,
    private _reservaService: ReservaService,
    private _empresaService: EmpresaService,
    private _dialog: ConfirmationService,
    private _viajeService:ViajeService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getUsuarioCompartido();
  }

  showTab(tabId: string) {
    this.currentTab = tabId;
  }

  getUsuarioCompartido() {
    this.userDataService.currentUser$.subscribe(user => {
      if (user) {
        //console.log('Usuario recibido:', user);
        this.user = user;
        this.PK_Usuario = this.user.PK_Usuario;
        //console.log('PK de usuario:', this.PK_Usuario);
  
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
        } else if (typeof data === 'string')  {
          this.listReservasFuturas = []; // Si no hay reservas, establecer un array vacío
          console.log(data);
        } else {
          console.error('La respuesta no es un array:', data);
          this.listReservasFuturas = []; // Si no hay reservas, establecer un array vacío
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

  /* PARA MOSTRAR SOLO LAS RESERVAS CON ESTADO RESERVA
   getReservasFuturasPasajero(PK_Usuario: number): void {
    this.loading = true;
    this._reservaService.getReservasFuturasPasajero(PK_Usuario).subscribe(
      data => {
        console.log('Datos recibidos:', data);
        // Verifica que `data` sea un array
        if (Array.isArray(data)) {
          // Filtrar reservas que no están canceladas
          this.listReservasFuturas = data
            .filter(reserva => reserva.estado_reserva !== 'cancelada') // Excluir reservas canceladas
            .map(reserva => ({
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
  }*/ 

  getReservasPasadasPasajero(PK_Usuario: number): void {
    this.loading = true;
    this._reservaService.getReservasPasadasPasajero(PK_Usuario).subscribe(
      data => {
        //console.log('Datos recibidos:', data);
        // Verifica que `data` sea un array
        if (Array.isArray(data)) {
          this.listReservasPasadas = data.map(reserva => ({
            ...reserva,
            paradas: typeof reserva.paradas === 'string' ? this.parseParadas(reserva.paradas) : []
          }));
        } else if (typeof data === 'string')  {
          this.listReservasPasadas = []; // Si no hay reservas, establecer un array vacío
          console.log(data);
        } else {
          console.error('La respuesta no es un array:', data);
          this.listReservasPasadas = []; // Si no hay reservas, establecer un array vacío
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
    const paradasArray = paradasStr.split(';');
    //console.log('Array de paradas:', paradasArray);
    
    return paradasArray.map(paradaStr => {
      // Eliminar espacios en blanco antes y después de la cadena
      const trimmedParadaStr = paradaStr.trim();
      const matches = trimmedParadaStr.match(/Orden:\s*(\d+),\s*Parada:\s*([^,]+),\s*Localidad:\s*([^,]+),\s*Provincia:\s*([^,]+),\s*Coordenadas:\s*([\-\d.]+),\s*([\-\d.]+)/);
      
      if (matches) {
        const paradaData = {
          orden: parseInt(matches[1], 10),
          parada: matches[2].trim(),
          coordenadas: `${matches[5]},${matches[6]}` // Juntamos latitud y longitud
        } as ViajeParada;
        
        //console.log('Parada procesada:', paradaData);
        return paradaData;
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
        this.loading = false; // Asegúrate de detener la carga aquí
        this.getReservasFuturasPasajero(this.PK_Usuario); // Actualiza la lista de reservas
        this.mensaje('Reserva cancelada con éxito');
      },
      error => {
        this.loading = false; // Detener la carga si hay un error
        console.error('Error al cancelar la reserva:', error);
        this.mensaje('Error al cancelar la reserva');
      }
    );
  }


  mostrarTicket(idReserva: number) {
    const reserva = this.listReservasFuturas.find(res => res.PK_Reserva === idReserva);
    if (reserva) {
        // Verifica si la reserva está cancelada
        if (reserva.estado_reserva === 'Cancelado') {
            this.mensaje('No se puede abrir el ticket, la reserva ha sido cancelada.');
            return; // Salir del método si la reserva está cancelada
        }
        this.selectedTicketData = reserva;
        this.showModal = true;  // Mostrar el modal
    } else {
        console.log('No se encontró reserva con ID:', idReserva);
        this.mensaje('No se encontró la reserva seleccionada');
    }
}

mostrarInfoPago(idReserva: number): void {
  const reserva = this.listReservasFuturas.find(res => res.PK_Reserva === idReserva);

  if (!reserva) {
    this.mensaje('No se encontró la reserva seleccionada.');
    return;
  }

  if (reserva.estado_reserva === 'Cancelado') {
    this.mensaje('No se puede abrir la información de pago. La reserva está cancelada.');
    return;
  }

  // Obtener el ID de la empresa y del viaje
  const idEmpresa = reserva.PK_Empresa;
  const idViaje = reserva.PK_Viaje;

  // Primero obtenemos la información de la empresa
  this._empresaService.getEmpresa(idEmpresa ?? 0).subscribe(
    empresa => {
      console.log('Datos de la empresa:', empresa);

      // Después obtenemos la información del viaje
      this._viajeService.getViajeXid(idViaje ?? 0).subscribe(
        viaje => {
          // Asegúrate de que 'viaje' es un array y accede al primer objeto

          console.log('Datos del viaje:', viaje);
         

          // Aquí estamos preparando los datos que se enviarán al modal
          const modalData = {
            razon_social: empresa.razon_social,
            email: empresa.email,
            alias:empresa.alias,  
            viaje:viaje,
            idReserva: idReserva,
          };

          // Muestra los datos que se enviarán al modal
          console.log('Datos a enviar al modal:', modalData);

          // Ahora que tenemos ambos datos, abrimos el modal
          this.dialog.open(ModalPagoComponent, {
            data: modalData
          });
        },
        error => {
          console.error('Error al obtener los datos del viaje:', error);
          this.mensaje('Error al obtener la información del viaje');
        }
      );
    },
    error => {
      console.error('Error al obtener los datos de la empresa:', error);
      this.mensaje('Error al obtener la información de la empresa');
    }
  );
}

  mostrarInfoEmpresa(idReserva: number) {
    //console.log('Buscando ticket con ID:', idReserva);
    const reserva = this.listReservasFuturas.find(res => res.PK_Reserva === idReserva);
    
    if (reserva) {
        console.log('Reserva encontrada:', reserva);
        
        const idEmpresa = reserva.PK_Empresa;
        const idEmpresaNumber = Number(idEmpresa);
        this._empresaService.getEmpresa(idEmpresaNumber).subscribe(
            empresa => {
                console.log('Datos de la empresa:', empresa);
                this.selectedEmpresaData = empresa;  // Almacenar los datos de la empresa
                
                // Abre el modal y pasa los datos de la empresa
                const dialogRef = this.dialog.open(ModalcontactEmpresaComponent, {
                    data: this.selectedEmpresaData // Pasa los datos aquí
                });

                // Puedes manejar la respuesta del modal si es necesario
                dialogRef.afterClosed().subscribe(result => {
                    console.log('El modal se cerró con el resultado:', result);
                });
            },
            error => {
                console.error('Error al obtener los datos de la empresa:', error);
                this.mensaje('Error al obtener la información de la empresa');
            }
        );
    } else {
        console.log('No se encontró reserva con ID:', idReserva);
        this.mensaje('No se encontró la reserva seleccionada');
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
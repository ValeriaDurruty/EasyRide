import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CharterService } from '../../services/charter.service';
import { Charter } from '../../interfaces/charter.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from '../../services/dialog.confirm';
import { Subscription } from 'rxjs';
import { Usuario } from '../../interfaces/user.interface';
import { Empresa } from '../../interfaces/empresa.interface';
import { UserDataService } from '../../shared/user-data.service';
import { EmpresaService } from '../../services/empresa.service';
import { Viaje } from '../../interfaces/viaje.interface';
import { ViajeService } from '../../services/viaje.service';
import { Parada } from '../../interfaces/parada.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { ReservaEmpresa } from '../../interfaces/reservaEmpresa.interface';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../interfaces/reserva.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { ParadaService } from '../../services/parada.service';

@Component({
  selector: 'app-v-empresa',
  templateUrl: './v-empresa.component.html',
  styleUrls: [
    '/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css',
    './v-empresa.component.css'
  ]
})
export class VEmpresaComponent implements OnInit, OnDestroy {

  listCharters: Charter[] = [];
  listViajesParadas: Viaje[] = [];
  currentTab: string = 'tab1'; // Pestaña activa por defecto
  loading: boolean = false; // Variable para mostrar la barra de carga
  user: Usuario | null = null;
  empresa: Empresa | null = null; // Nueva variable para almacenar la empresa
  private userSubscription: Subscription | null = null;
  private logoutSubscription: Subscription | null = null;
  idEmpresa: number = 0;
  listParadas: Parada[] = [];
  fecha: Date = new Date(); // Definición de la propiedad fecha

  listReservasFut:ReservaEmpresa[]=[];
  listReservasPas:ReservaEmpresa[]=[];
  reservas: any[] = [];
  showModal: boolean = false;  
  selectedViajeId: number | null = null;
  selectedReservaData: ReservaEmpresa[] = [];
  viaje: Viaje | null = null;

  constructor(
    private _charterService: CharterService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private userDataService: UserDataService,
    private empresaService: EmpresaService,
    private _dialog: ConfirmationService,
    private _viajeService: ViajeService,
    private _reservaService:ReservaService,
    private _paradaService :ParadaService
  ) {}

  ngOnInit(): void {
    //this.obtenerCharters();
    this.getUsuarioCompartido();
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.showTab(tab);
      }
    });
   // this.obtenerViajesxEmpresa();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }

  showTab(tabId: string): void {
    this.currentTab = tabId;
  }

  getUsuarioCompartido(): void {
    this.userSubscription = this.userDataService.currentUser$.subscribe(user => {
      this.user = user;
      if (this.user) {

        if (this.user.FK_Rol === 2) { // Verifica si el usuario es un empleado
          this.loadEmpresa(this.user.FK_Empresa);
          this.empresaService.setEmpresaId(this.user.FK_Empresa);
        }
      }
    });
  }

  loadEmpresa(fkEmpresa: number): void {
    console.log('ID de empresa pasado a loadEmpresa:', fkEmpresa); // Agregado para depuración
    this.empresaService.getEmpresa(fkEmpresa).subscribe(
      empresa => {
        this.empresa = empresa;
        this.idEmpresa = fkEmpresa; // Guarda la fk_empresa
        this.obtenerCharters(fkEmpresa); // Cargar charters para la empresa
        this.obtenerViajesxEmpresa(fkEmpresa); // Cargar viajes para la empresa
        this.obtenerReservasPasadas(fkEmpresa);
        this.obtenerReservasFuturas(fkEmpresa);
        this.obtenerParadas(fkEmpresa);
      },
      error => {
        console.error('Error al cargar la empresa:', error);
        this.mensaje('Error al cargar la empresa');
      }
    );
  }
  
  obtenerParadas(fkEmpresa: number): void {
    this.loading = true;
    this._paradaService.getParadasXEmpresa(fkEmpresa).subscribe(
      data => {
        // Verifica el tipo de datos recibido
        if (Array.isArray(data)) {
          this.listParadas = data;
        } else if (typeof data === 'string') {
          this.listParadas = []; // Asigna un array vacío si es un string
        } else {
          // Maneja el caso en que el tipo de datos no es ni array ni string
          console.error('Tipo de dato inesperado:', data);
          this.listParadas = []; // Asegura que listParadas siempre sea un array
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error('Error al obtener las paradas:', error);
        this.mensaje('Error al obtener las paradas');
      }
    );
  }
  

  obtenerCharters(fkEmpresa: number): void {
    console.log('ID de empresa pasado a obtenerCharters:', fkEmpresa); // Agregado para depuración
    this.loading = true;
    this._charterService.getChartersXEmpresa(fkEmpresa).subscribe(
      data => {
        // Verifica el tipo de datos recibido
        if (Array.isArray(data)) {
          this.listCharters = data;
        } else if (typeof data === 'string') {
          this.listCharters = []; // Asigna un array vacío si es un string
        } else {
          // Maneja el caso en que el tipo de datos no es ni array ni string
          console.error('Tipo de dato inesperado:', data);
          this.listCharters = []; // Asegura que listCharters siempre sea un array
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error('Error al obtener los charters:', error);
        this.mensaje('Error al obtener los charters');
      }
    );
  }
  

  obtenerViajesxEmpresa(fkEmpresa: number): void {
    this.loading = true;
    this._viajeService.getViajesXEmpresa(fkEmpresa).subscribe(
      data => {
        this.loading = false; // Asegúrate de desactivar el indicador de carga aquí
        if (Array.isArray(data)) {
          this.listViajesParadas = data.map(viaje => ({
            ...viaje,
            paradas: typeof viaje.paradas === 'string' ? this.parseParadas(viaje.paradas) : []
          }));
        } else if (typeof data === 'string') {
          this.listViajesParadas = []; // Asigna un array vacío si es un string
        } else {
          // Maneja el caso en que el tipo de datos no es ni array ni string
          console.error('Tipo de dato inesperado:', data);
          this.listViajesParadas = []; // Asegura que listViajesParadas siempre sea un array
        }
      },
      error => {
        this.loading = false;
        console.error('Error al obtener los viajes:', error);
        this.mensaje('Error al obtener los viajes');
      }
    );
  }
  

  //La podemos sacar,la otra anda para todo
  /*parseParadas(paradasStr: string): ViajeParada[] {
    return paradasStr.split(';').map(paradaStr => {
      const matches = paradaStr.match(/PK_Viaje_parada: (\d+), PK_Parada: (\d+), Orden: (\d+), Parada: ([^,]+), Localidad: ([^,]+), Provincia: ([^;]+)/);
      if (matches) {
        return {
          PK_Viaje_Parada: parseInt(matches[1], 10),
          FK_Parada: parseInt(matches[2], 10),
          orden: parseInt(matches[3], 10),
          parada: matches[4],
        };
      }
      return null;
    }).filter(parada => parada !== null) as ViajeParada[];
  }*/
  




  confirmDelete(id: number): void {
    this._dialog.confirm('¿Seguro que quieres eliminar?').subscribe(result => {
      if (result) {
        this.deleteCharter(id);
      }
    });
  }

  deleteCharter(id: number): void {
    this.loading = true;
    this._charterService.deleteCharter(id).subscribe(
      () => {
        this.obtenerCharters(this.idEmpresa);
        this.mensaje('Charter eliminado con éxito');
      },
      error => {
        this.loading = false;
        console.error('Error al eliminar el charter:', error);
        this.mensaje(error.error.message);
      }
    );
  }

  confirmDeleteViaje(id: number): void {
    this._dialog.confirm('¿Seguro que quieres eliminar?').subscribe(result => {
      if (result) {
        this.deleteViaje(id);
      }
    });
  }

  deleteViaje(id: number): void {
    this.loading = true;
    this._viajeService.deleteViaje(id).subscribe(
      () => {
        this.obtenerViajesxEmpresa(this.idEmpresa);
        this.mensaje('Viaje eliminado con éxito');
      },
      error => {
        this.loading = false;
        console.error('Error al eliminar el viaje:', error);
        this.mensaje(error.error.message);
      }
    );
  }

  confirmDeleteParada(id: number): void {
    this._dialog.confirm('¿Seguro que quieres eliminar?').subscribe(result => {
      if (result) {
        this.deleteParada(id);
      }
    });
  }

  deleteParada(id: number): void {
    this.loading = true;
    this._paradaService.deleteParada(id).subscribe(
      () => {
        this.obtenerParadas(this.idEmpresa); // Cambiado de obtenerParadasXEmpresa a obtenerParadas
        this.mensaje('Parada eliminada con éxito');
      },
      error => {
        this.loading = false;
        console.error('Error al eliminar el viaje:', error);
        this.mensaje(error.error.message);
      }
    );
  }
  

  //RESERVAS TABS
  obtenerReservasPasadas(fkEmpresa: number): void {
    this.loading = true;
    this._reservaService.getReservasPasadasEmpresa(fkEmpresa).subscribe(
      data => {
        this.loading = false; // Asegúrate de desactivar el indicador de carga aquí
        if (Array.isArray(data)) {
          this.listReservasPas = data.map(reservaEmpresa => {
            // Agregar un console.log para el campo reservas
            console.log('Contenido de reservas:', reservaEmpresa.reservas);
  
            return {
              ...reservaEmpresa,
              paradas: typeof reservaEmpresa.paradas === 'string' ? this.parseParadas(reservaEmpresa.paradas) : [],
              reservas: typeof reservaEmpresa.reservas === 'string' ? this.parseReservas(reservaEmpresa.reservas) : [],
            };
          });
        } else if (typeof data === 'string') {
          this.listReservasPas = []; // Asigna un array vacío si es un string
        } else {
          // Maneja el caso en que el tipo de datos no es ni array ni string
          console.error('Tipo de dato inesperado:', data);
          this.listReservasPas = []; // Asegura que listReservasPas siempre sea un array
        }
      },
      error => {
        this.loading = false;
        console.error('Error al obtener las reservas pasadas:', error);
        this.mensaje(error.error.message);
      }
    );
  }

  
  // Método para obtener las reservas futuras
  obtenerReservasFuturas(fkEmpresa: number): void {
    this.loading = true;
    this._reservaService.getReservasFuturasEmpresa(fkEmpresa).subscribe(
      data => {
        this.loading = false; // Asegúrate de desactivar el indicador de carga aquí
        if (Array.isArray(data)) {
          this.listReservasFut = data.map(reservaEmpresa => ({
            ...reservaEmpresa,
            paradas: typeof reservaEmpresa.paradas === 'string' ? this.parseParadas(reservaEmpresa.paradas) : [],
            reservas: typeof reservaEmpresa.reservas === 'string' ? this.parseReservas(reservaEmpresa.reservas) : [],
          }));
        } else if (typeof data === 'string') {
          this.listReservasFut = []; // Asigna un array vacío si es un string
        } else {
          // Maneja el caso en que el tipo de datos no es ni array ni string
          console.error('Tipo de dato inesperado:', data);
          this.listReservasFut = []; // Asegura que listReservasFut siempre sea un array
        }
      },
      error => {
        this.loading = false;
        console.error('Error al obtener las reservas futuras:', error);
        this.mensaje(error.error.message);
      }
    );
  }
  

  parseReservas(reservasString: string): Reserva[] {
    return reservasString.split(';').map(reservaStr => {
      reservaStr = reservaStr.trim(); // Eliminar espacios en blanco al inicio y al final
      if (reservaStr) {
        const matches = reservaStr.match(
          /PK_Usuario: (\d+), Nombre: ([^,]+), Apellido: ([^,]+), PK_Reserva: (\d+), Fecha Creación: ([^,]+), Estado Reserva: ([^;]+)/
        );

        if (matches) {
          const fechaCreacionStr = matches[5];
          const fechaCreacion = this.convertirFecha(fechaCreacionStr);

          // Verifica si la fecha es válida
          if (isNaN(fechaCreacion.getTime())) {
            console.error('Fecha inválida:', fechaCreacionStr);
          }

          return {
            FK_Usuario: parseInt(matches[1], 10),
            nombre: matches[2],
            apellido: matches[3],
            PK_Reserva: parseInt(matches[4], 10),
            fecha_creacion: fechaCreacion,
            estado_reserva: matches[6]
          } as Reserva;
        } else {
          console.error('No se pudo parsear la reserva:', reservaStr);
        }
      }
      return null;
    }).filter(reserva => reserva !== null) as Reserva[];
  }

  convertirFecha(fechaStr: string): Date {
    // Convierte la fecha en formato DD-MM-YYYY a YYYY-MM-DD
    const [dia, mes, ano] = fechaStr.split('-');
    return new Date(`${ano}-${mes}-${dia}`);
  }
  formatFecha(fecha?: Date): string {
    if (!fecha) {
      return ''; // Retorna una cadena vacía si la fecha es undefined
    }
    
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const ano = fecha.getFullYear();
    return `${dia}/${mes}/${ano}`;
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


  openModal(viajeId: number) {
    console.log('ID de viaje recibido en openModal:', viajeId);
  
    // Filtra las reservas para el viaje dado
    this.selectedReservaData = this.listReservasFut.filter(reserva => reserva.PK_Viaje === viajeId);
  
    console.log('Datos seleccionados para el modal:', this.selectedReservaData);
  
    // Solo muestra el modal si hay reservas para el viaje dado
    if (this.selectedReservaData.length > 0) {
      this.showModal = true;
      console.log('Modal debería estar visible');
    } else {
      this.showModal = false;
      console.log('No se encontraron reservas para el viaje con ID:', viajeId);
    }
  }
  

  // Método para cerrar el modal
  closeModal() {
    this.showModal = false;
  }

  // Método para manejar el cierre del modal desde el componente hijo
  handleClose() {
    this.showModal = false;
  }

mensaje(mensaje: string): void {
  this._snackBar.open(mensaje, 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  });
}
}
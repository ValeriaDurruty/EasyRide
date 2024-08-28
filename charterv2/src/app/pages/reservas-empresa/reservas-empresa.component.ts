import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDataService } from '../../shared/user-data.service';
import { EmpresaService } from '../../services/empresa.service';
import { ReservaService } from '../../services/reserva.service';
import { Usuario } from '../../interfaces/user.interface';
import { Empresa } from '../../interfaces/empresa.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { Parada } from '../../interfaces/parada.interface';
import { Reserva } from '../../interfaces/reserva.interface';
import { ReservaEmpresa } from '../../interfaces/reservaEmpresa.interface';

@Component({
  selector: 'app-reservas-empresa',
  templateUrl: './reservas-empresa.component.html',
  styleUrls: [
    '/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css',
    './reservas-empresa.component.css'
  ]
})
export class ReservasEmpresaComponent implements OnInit {
  listReservasFut:ReservaEmpresa[]=[];
  listReservasPas:ReservaEmpresa[]=[];

  loading: boolean = false; // Variable para mostrar la barra de carga
  user: Usuario | null = null;
  idEmpresa: number = 0;
  empresa: Empresa | null = null; // Nueva variable para almacenar la empresa
  listParadas: Parada[] = [];

  currentTab: string = 'tab1'; // Pestaña activa por defecto

  constructor(
    private userDataService: UserDataService,
    private _empresaService: EmpresaService,
    private _reservaService: ReservaService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getUsuarioCompartido();
  }

  showTab(tabId: string) {
    this.currentTab = tabId;
  }

  getUsuarioCompartido() {
    this.userDataService.currentUser$.subscribe(user => {
      this.user = user;
      if (this.user) {
        console.log('Nombre de usuario:', this.user.nombre);
        console.log('Apellido de usuario:', this.user.apellido);
        console.log('Email de usuario:', this.user.email);
        console.log('Rol de usuario:', this.user.FK_Rol);
        if (this.user.FK_Rol === 2) { // Verifica si el usuario es un empleado
          this.loadEmpresa(this.user.FK_Empresa);
          this._empresaService.setEmpresaId(this.user.FK_Empresa);
        }
      }
    });
  }

  loadEmpresa(fkEmpresa: number): void {
    console.log('ID de empresa pasado a loadEmpresa:', fkEmpresa); // Agregado para depuración
    this._empresaService.getEmpresa(fkEmpresa).subscribe(
      empresa => {
        this.empresa = empresa;
        this.idEmpresa = fkEmpresa; // Guarda la fk_empresa
        this.obtenerReservasPasadas(fkEmpresa);
        this.obtenerReservasFuturas(fkEmpresa);
      },
      error => {
        console.error('Error al cargar la empresa:', error);
        this.mensaje('Error al cargar la empresa');
      }
    );
  }

  obtenerReservasPasadas(fkEmpresa: number): void {
    this.loading = true;
    this._reservaService.getReservasPasadasEmpresa(fkEmpresa).subscribe(
      data => {
        console.log('Datos recibidos:', data);
        
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
  // Método para obtener las reservas futuras
  obtenerReservasFuturas(fkEmpresa: number): void {
    this.loading = true;
    this._reservaService.getReservasFuturasEmpresa(fkEmpresa).subscribe(
      data => {
        console.log('Datos recibidos:', data);
        // Verifica que `data` sea un array
        if (Array.isArray(data)) {
          this.listReservasFut = data.map(reservaEmpresa => ({
            ...reservaEmpresa,
            paradas: typeof reservaEmpresa.paradas === 'string' ? this.parseParadas(reservaEmpresa.paradas) : [],
            reservas: typeof reservaEmpresa.reservas === 'string' ? this.parseReservas(reservaEmpresa.reservas) : [],
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
  
  mensaje(mensaje: string): void {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}

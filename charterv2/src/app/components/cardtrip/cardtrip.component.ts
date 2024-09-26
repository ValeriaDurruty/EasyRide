import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Viaje } from '../../interfaces/viaje.interface';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cardtrip',
  templateUrl: './cardtrip.component.html',
  styleUrls: ['./cardtrip.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css'
  ]
})
export class CardtripComponent implements OnInit {
  @Input() viajes: Viaje[] = [];
  userRole: number | null = null;
  userValidar: number | null = null
  userNombre: string | null = null;
  userApellido: string | null = null;
  private userSubscription: Subscription | undefined; // Declara la propiedad


  constructor(private router: Router, private userService: UserService, 
    private _snackBar: MatSnackBar, private ngZone:NgZone,
    private route: ActivatedRoute,) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const currentUrl = this.router.url;
      if (currentUrl === '/Vista-Trips') {
        this.loadCardtripData();
      }
    });
  }

  //si user es null, cuando se presione el boton de reservar, se redirigira a la pagina de login y luego a la de reservar, únicamente si el usuario logueado es un cliente, o sea, si su rol es 3
  reservar(id: number): void {
    console.log('Iniciando reserva con ID:', id);
  
    if (this.userService.isAuthenticated()) {  // Verifica si el usuario está autenticado
      console.log('Usuario está autenticado.');
  
      this.userSubscription = this.userService.getCurrentUser().subscribe(user => {
        if (user) {
          // Asigna los datos del usuario logueado
          this.userRole = user.FK_Rol;
          console.log('Usuario desde CardtripComponent:', user);
  
          // Lógica para redireccionar según el rol del usuario
          console.log('Rol del usuario:', this.userRole);
          this.ngZone.run(() => {  // Ejecuta las actualizaciones en el contexto de Angular
            switch (this.userRole) {
              case 3: // Cliente
                console.log('Rol de cliente, redirigiendo a /Reservar', id);
                this.router.navigate(['/Reservar', id]);
                break;
              case 2: // Empleado
                this.mensaje('No puedes reservar un viaje siendo un empleado de una empresa');
                break;
              case 1: // Administrador
                this.mensaje('No puedes reservar un viaje siendo un administrador');
                break;
              default:
                console.log('Rol de usuario no reconocido');
            }
          });
        } else {
          console.log('Usuario no encontrado.');
        }
      });
    } else {
      console.log('No hay usuario autenticado, redirigiendo a login');
      this.ngZone.run(() => {  // Ejecuta la redirección en el contexto de Angular
        this.router.navigate(['/LogIn'], { queryParams: { returnUrl: `/Reservar/${id}` } });
      });
    }
  }
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  private loadCardtripData() {
    // Implementa aquí la lógica para cargar los datos específicos de la ruta '/Cardtrip'
    console.log('Cargando datos para Cardtrip');
  }

  mensaje(mensaje:string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']  // Es para darle estilo
    });
  }
}

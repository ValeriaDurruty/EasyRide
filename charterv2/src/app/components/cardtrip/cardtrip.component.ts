import { Component, Input, OnInit, NgZone } from '@angular/core';
import { Viaje } from '../../interfaces/viaje.interface';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private isProcessing: boolean = false; // Flag para prevenir doble reserva

  constructor(private location: Location, private router: Router, private userService: UserService, private _snackBar: MatSnackBar, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userRole = user.FK_Rol; // Asigna el rol del usuario logeado
        this.userValidar = user.validar; // Asigna el validar del usuario logeado
        this.userNombre = user.nombre; // Asigna el nombre del usuario logeado
        this.userApellido = user.apellido; // Asigna el apellido del usuario logeado
        console.log('Usuario desde CardtripComponent:', user);
      } else {
        console.log('Usuario no encontrado.');
        console.log('Usuario desde CardtripComponent:', user);
      }
    });
  }

  //si user es null, cuando se presione el boton de reservar, se redirigira a la pagina de login y luego a la de reservar, únicamente si el usuario logueado es un cliente, o sea, si su rol es 3
  reservar(id: number): void {
    // Verificar si ya se está procesando una reserva para prevenir ejecución doble
    if (this.isProcessing) return;
    
    this.isProcessing = true; // Marcar como procesando
  
    this.ngZone.run(() => {
      if (this.userRole === null) {
        // Usuario no logueado, redirigir a la página de login con el returnUrl
        this.router.navigate(['/LogIn'], { queryParams: { returnUrl: `/Reservar/${id}` } });
        this.isProcessing = false; // Liberar flag de procesamiento
      } else if (this.userRole === 3) {
        // Usuario cliente, permitir reservar
        this.router.navigate(['/Reservar', id]);
      } else if (this.userRole === 2) {
        // Usuario empleado, mostrar mensaje
        this.mensaje('No puedes reservar un viaje siendo un empleado de una empresa');
      } else if (this.userRole === 1) {
        // Usuario administrador, mostrar mensaje
        this.mensaje('No puedes reservar un viaje siendo un administrador');
      }
      this.isProcessing = false; // Liberar flag de procesamiento
    });
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

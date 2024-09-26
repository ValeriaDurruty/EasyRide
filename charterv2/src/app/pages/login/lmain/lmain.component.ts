import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { Usuario } from '../../../interfaces/user.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from '../../../shared/user-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lmain',
  templateUrl: './lmain.component.html',
  styleUrls:['/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css','./lmain.component.css']
})
export class LmainComponent {
  passwordVisible: boolean = false;
  passwordTextColor: string = '#fff'; // Color de texto predeterminado
  user$: Observable<Usuario> | undefined;
  returnUrl: string = '';

  @ViewChild('emailUsuario') emailUsuarioRef!: ElementRef;
  @ViewChild('contraseñaLoginUsuario') contraseñaLoginUsuarioRef!: ElementRef;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private userDataService: UserDataService, private _snackBar: MatSnackBar) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordField = this.contraseñaLoginUsuarioRef.nativeElement as HTMLInputElement;
    passwordField.type = this.passwordVisible ? 'text' : 'password';
    this.passwordTextColor = this.passwordVisible ? '#000' : '#333'; // Cambia el color del texto
  }

  ngOnInit(): void {
    // Captura el parámetro de retorno de la URL
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async login() {
    try {
      const correo = this.emailUsuarioRef.nativeElement.value;
      const contraseña = this.contraseñaLoginUsuarioRef.nativeElement.value;
      const userCredential = await this.userService.loginUsuario(correo, contraseña);
      const user = userCredential.user;
      console.log('Usuario autenticado:', user);
      if (user && user.email) {
        console.log('Usuario autenticado:', user);
        console.log('Email:', user.email);

        // Obtener datos del usuario desde la base de datos
        this.user$ = this.userService.getUsuarioPorEmail(user.email);
        this.user$.subscribe(userData => {
          console.log('Datos del usuario:', userData);
          this.userDataService.setUser(userData); // Guardar datos del usuario en el servicio compartido
          
          // Redirigir a la página correspondiente según el rol del
          if (userData.FK_Rol == 1) {
            // Redirige al usuario a la URL original si `returnUrl` existe; de lo contrario, va a `/V-cliente`
            if (this.returnUrl && this.returnUrl !== '/') {
              this.mensaje('No puedes reservar un viaje siendo un administrador.');
              this.router.navigateByUrl(this.returnUrl); // Redirige al usuario a la URL original
            } else {
              this.router.navigate(['/V-admin']);
            }
          }
          else if (userData.FK_Rol == 2) {
            if (userData.validar == 0) {
              //borrar datos del usuario
              this.userService.logoutUsuario().then(() => {
                this.router.navigate(['/LogIn']);
                this.mensaje('Usuario no validado, por favor comuniquese con el administrador.');
              }).catch(error => {
                console.error('Error:', error);
              });
            } else {
              // Redirige al usuario a la URL original si `returnUrl` existe; de lo contrario, va a `/V-cliente`
              if (this.returnUrl && this.returnUrl !== '/') {
                this.mensaje('No puedes reservar un viaje siendo un empleado de una empresa.');
                this.router.navigateByUrl(this.returnUrl); // Redirige al usuario a la URL original
              } else {
                this.router.navigate(['/V-empresa']);
              }
            }
          }
          else if (userData.FK_Rol == 3) {
            // Redirige al usuario a la URL original si `returnUrl` existe; de lo contrario, va a `/V-cliente`
            if (this.returnUrl && this.returnUrl !== '/') {
              this.router.navigateByUrl(this.returnUrl); // Redirige al usuario a la URL original
            } else {
              this.router.navigate(['/V-cliente']);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error autenticando usuario:', error);
      this.mensaje('Usuario no registrado o contraseña incorrecta.');
    }
  }

  mensaje(mensaje:string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']  // Es para darle estilo
    });
  }
};
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { addUsuario } from '../../interfaces/addUsuario.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Empresa } from '../../interfaces/empresa.interface';
import { EmpresaService } from '../../services/empresa.service';
import e from 'express';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: [
    '/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css',
    './registrar.component.css'
  ]
})
export class RegistrarComponent implements OnInit {
  passwordVisible: boolean = false;
  passwordTextColor: string = '#fff';
  esUsuario: boolean = true;
  mostrarFormulario: boolean = false;
  empresas: Empresa[] = [];


  @ViewChild('nombreUsuario') nombreUsuarioRef!: ElementRef;
  @ViewChild('apellidoUsuario') apellidoUsuarioRef!: ElementRef;
  @ViewChild('dniUsuario') dniUsuarioRef!: ElementRef;
  @ViewChild('correoUsuario') correoUsuarioRef!: ElementRef;
  @ViewChild('contraseñaUsuario') contraseñaUsuarioRef!: ElementRef;
  @ViewChild('empresaUsuario') empresaUsuarioRef!: ElementRef;

  constructor(private userService: UserService, private _empresaService: EmpresaService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this._empresaService.getEmpresas().subscribe(data => {
      this.empresas = data;
    });
  };

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordField = this.contraseñaUsuarioRef.nativeElement as HTMLInputElement;
    passwordField.type = this.passwordVisible ? 'text' : 'password';
    this.passwordTextColor = this.passwordVisible ? '#000' : '#333';
  }

  mostrarUsuario() {
    this.esUsuario = true;
    this.mostrarFormulario = true;
  }

  mostrarEmpresa() {
    this.esUsuario = false;
    this.mostrarFormulario = true;
  }

  /*async registrar() {
    if (this.esUsuario) {
      //Registrando como Usuario
      try {
        const correo = this.correoUsuarioRef.nativeElement.value;
        const contraseña = this.contraseñaUsuarioRef.nativeElement.value;
        const user = await this.userService.registrarUsuario(correo, contraseña);
        const usuario: addUsuario = {
          nombre: this.nombreUsuarioRef.nativeElement.value,
          apellido: this.apellidoUsuarioRef.nativeElement.value,
          nro_documento: +this.dniUsuarioRef.nativeElement.value,
          email: correo,
          contrasenia: contraseña,
          FK_Rol: 3, //FK_Rol de usuario
      };


      // Agregar el usuario a la base de datos
        this.userService.addUsuario(usuario).subscribe(() => {
          console.log('Usuario agregado con éxito');
          this.router.navigate(['/LogIn']);
          this.mensajeExito();
        });     
      } catch (error) {
          console.error('Error registrando usuario:', error);
          this.mensajeError();
        }
      }else {
        //Registrando como Empleado
        try {
          const correo = this.correoUsuarioRef.nativeElement.value;
          const contraseña = this.contraseñaUsuarioRef.nativeElement.value;
          const user = await this.userService.registrarUsuario(correo, contraseña);
          const usuario: addUsuario = {
            nombre: this.nombreUsuarioRef.nativeElement.value,
            apellido: this.apellidoUsuarioRef.nativeElement.value,
            nro_documento: +this.dniUsuarioRef.nativeElement.value,
            email: correo,
            contrasenia: contraseña,
            FK_Empresa: +this.empresaUsuarioRef.nativeElement.value,
            FK_Rol: 2 // FK_Rol de empleado
          };
  
  
        // Agregar el usuario a la base de datos
          this.userService.addUsuario(usuario).subscribe(() => {
            console.log('Usuario agregado con éxito');
            this.router.navigate(['/LogIn']);
            this.mensajeExito();
          })     
        } catch (error) {
            console.error('Error registrando usuario:', error);
            this.mensajeError();
          }
      }
    }*/

      async registrar() {
        if (this.esUsuario) {
          // Registrando como Usuario
          try {
            const correo = this.correoUsuarioRef.nativeElement.value;
            const contraseña = this.contraseñaUsuarioRef.nativeElement.value;
            const user = await this.userService.registrarUsuario(correo, contraseña);
            const usuario: addUsuario = {
              nombre: this.nombreUsuarioRef.nativeElement.value,
              apellido: this.apellidoUsuarioRef.nativeElement.value,
              nro_documento: +this.dniUsuarioRef.nativeElement.value,
              email: correo,
              contrasenia: contraseña,
              FK_Rol: 3, // FK_Rol de usuario
            };
      
            // Agregar el usuario a la base de datos
            this.userService.addUsuario(usuario).subscribe(() => {
              this.mensajeExito('Usuario registrado con éxito');
              setTimeout(() => {
                console.log('Usuario agregado con éxito');
                this.router.navigate(['/LogIn']);
              }, 2000);
            }, (error) => {
              console.error('Error registrando usuario en la base de datos:', error);
              this.mensajeError('Error registrando usuario en la base de datos');
            });
      
          } catch (error: any) {
            console.error('Error registrando usuario:', error);
            if (error.code === 'auth/email-already-in-use') {
              this.mensajeError('El correo electrónico ya está registrado.');
            } else {
              this.mensajeError('Error registrando usuario');
            }
          }
        } else {
          // Registrando como Empleado
          try {
            const correo = this.correoUsuarioRef.nativeElement.value;
            const contraseña = this.contraseñaUsuarioRef.nativeElement.value;
            const user = await this.userService.registrarUsuario(correo, contraseña);
            const usuario: addUsuario = {
              nombre: this.nombreUsuarioRef.nativeElement.value,
              apellido: this.apellidoUsuarioRef.nativeElement.value,
              nro_documento: +this.dniUsuarioRef.nativeElement.value,
              email: correo,
              contrasenia: contraseña,
              FK_Empresa: +this.empresaUsuarioRef.nativeElement.value,
              FK_Rol: 2 // FK_Rol de empleado
            };
      
            // Agregar el usuario a la base de datos
            this.userService.addUsuario(usuario).subscribe(() => {
              this.mensajeExito('El usuario fue registrado con éxito');
              setTimeout(() => {
                console.log('Usuario agregado con éxito');
                this.router.navigate(['/LogIn']);
              }, 2000);
            }, (error) => {
              console.error('Error registrando usuario en la base de datos:', error);
              this.mensajeError('Error registrando usuario en la base de datos');
            });
      
          } catch (error: any) {
            console.error('Error registrando usuario:', error);
            if (error.code === 'auth/email-already-in-use') {
              this.mensajeError('El correo electrónico ya está registrado.');
            } else {
              this.mensajeError('Error registrando usuario');
            }
          }
        }
      }
      
      

  mensajeExito(mensaje:string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  mensajeError(mensaje:string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  resetFormulario() {
    this.nombreUsuarioRef.nativeElement.value = '';
    this.apellidoUsuarioRef.nativeElement.value = '';
    this.dniUsuarioRef.nativeElement.value = '';
    this.correoUsuarioRef.nativeElement.value = '';
    this.contraseñaUsuarioRef.nativeElement.value = '';
  }
}


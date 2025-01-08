// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Usuario } from "../interfaces/user.interface";
import { addUsuario } from "../interfaces/addUsuario.interface";
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private myAppUrl: string;
    private myApiUrl: string;
    
  constructor(private auth: Auth, private http: HttpClient) {
    this.myAppUrl = environment.endopoint;
    this.myApiUrl = 'api/usuarios/';
  }

  //Crea un usuario con email y contraseña en Firebase
  registrarUsuario(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  } 

  //Inicia sesión con email y contraseña de los usuarios almacenados en Firebase
  loginUsuario(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      // Obtén el token del usuario
      return userCredential.user.getIdToken().then((token) => {
        localStorage.setItem('token', token);
        sessionStorage.removeItem('reservaActual');
        return userCredential;
      });
    });
  }
  

  //Cierra la sesión de un usuario en Firebase
  async logoutUsuario() {
    await this.auth.signOut();
    localStorage.removeItem('token');
  }
  

  //Obtiene un usuario de la base de datos por correo electrónico
  getUsuarioPorEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(this.myAppUrl + this.myApiUrl + 'email/' + email);
  }

  //Obtiene los usuarios de la base de datos de SQL
  getUsuarios() : Observable <Usuario[]> {
    return this.http.get<Usuario[]>(this.myAppUrl + this.myApiUrl);
  }

  //Elimina un usuario de la base de datos de SQL
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + id);
  }

  //Agrega un usuario a la base de datos de SQL
  addUsuario(usuario: addUsuario): Observable<void> {
    return this.http.post<void>(this.myAppUrl + this.myApiUrl, usuario);
  }

  //Actualiza un usuario en la base de datos de SQL
  updateUsuario(usuario: Usuario): Observable<void> {
    return this.http.put<void>(this.myAppUrl + this.myApiUrl + usuario.PK_Usuario, usuario);
  }

  //Valida un usuario en la base de datos de SQL
  validarUsuario(id: number): Observable<void> {
    return this.http.put<void>(this.myAppUrl + this.myApiUrl + 'validar/' + id, null);
  }

  getCurrentUser(): Observable<Usuario | null> {
    return new Observable(subscriber => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        if (user) {
          //console.log('Email del usuario desde Firebase:', user.email);
          // Aquí debes obtener el usuario desde la base de datos si es necesario
          this.getUsuarioPorEmail(user.email!).subscribe(usuario => {
           // console.log('Usuario obtenido desde el backend:', usuario);
            subscriber.next(usuario);
          }, error => {
            console.error('Error al obtener el usuario desde el backend:', error);
            subscriber.next(null);
          });
        } else {
          subscriber.next(null);
        }
      });
      return () => unsubscribe(); // Limpiar la suscripción cuando el observable se complete
    });
  }
  

  isAuthenticated(): boolean {
    console.log('Verificando autenticación...');
  
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('Usuario autenticado.');
        return !!token;
      } else {
        console.log('Token no encontrado. Usuario no autenticado.');
        return false;
      }
    } else {
      console.log('localStorage no está disponible.');
      return false;
    }
  }  

  //Lo nuevo
  private redirectUrl: string | null = null;

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
    console.log('Redirect URL set to:', this.redirectUrl);
  }
  

  getRedirectUrl(): string | null {
    const url = this.redirectUrl;
    console.log(url);
    this.redirectUrl = null; // Limpiar después de usar
    return url;
  }
}

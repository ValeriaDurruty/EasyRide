//No hace que se recargue. Guardemos la otra por las dudas igual

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Usuario } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userSource = new BehaviorSubject<Usuario | null>(this.getStoredUser());
  currentUser$ = this.userSource.asObservable();
  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable();

  constructor() {
    // Restaurar usuario desde localStorage en la inicialización del servicio
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.userSource.next(storedUser);
    }
  }

  setUser(user: Usuario) {
    this.userSource.next(user);
    this.storeUser(user);
  }

  getUser(): Usuario | null {
    return this.userSource.value;
  }

  logout() {
    this.userSource.next(null);
    this.removeStoredUser();
    this.logoutSubject.next(); // Notifica a los componentes que se ha cerrado sesión
  }

  private storeUser(user: Usuario) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private getStoredUser(): Usuario | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  private removeStoredUser() {
    localStorage.removeItem('currentUser');
  }
}

//Anda tambien solo que pierde los datos
/*import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Usuario } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userSource = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.userSource.asObservable();
  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable();

  constructor() {
    // Restaurar usuario desde localStorage en la inicialización del servicio
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.userSource.next(storedUser);
    }
  }

  setUser(user: Usuario) {
    this.userSource.next(user);
  }

  getUser(): Usuario | null {
    return this.userSource.value;
  }

  logout() {
    this.userSource.next(null);
    this.logoutSubject.next(); // Notifica a los componentes que se ha cerrado sesión
  }

  private storeUser(user: Usuario) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private getStoredUser(): Usuario | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}*/


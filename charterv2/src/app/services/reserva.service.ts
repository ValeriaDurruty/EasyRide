import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Reserva } from "../interfaces/reserva.interface";
import { ReservaEmpresa } from "../interfaces/reservaEmpresa.interface";
import { ReservaPasajero } from "../interfaces/reservaPasajero.interface";


@Injectable({
  providedIn: "root"
})
export class ReservaService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/reservas/';
    }

    //Lista todas las reservas de un pasajero
    getReservasPasajero(id: number) : Observable <ReservaPasajero[]> {
      return this.http.get<ReservaPasajero[]>(this.myAppUrl + this.myApiUrl + 'usuario/' + id);
    }

    //Lista todas las reservas pasadas de un pasajero
    getReservasPasadasPasajero(id: number) : Observable <ReservaPasajero[]> {
        return this.http.get<ReservaPasajero[]>(this.myAppUrl + this.myApiUrl + 'usuario-pas/' + id);
    }

    //Lista todas las reservas futuras de un pasajero
    getReservasFuturasPasajero(id: number) : Observable <ReservaPasajero[]> {
        return this.http.get<ReservaPasajero[]>(this.myAppUrl + this.myApiUrl + 'usuario-fut/' + id);
    }

    //Lista todas las reservas de una empresa
    getReservasEmpresa(id: number) : Observable <Reserva[]> {
        return this.http.get<Reserva[]>(this.myAppUrl + this.myApiUrl + 'empresa/' + id);
    }
    
    //Lista todas las reservas pasadas de una empresa
    getReservasPasadasEmpresa(id: number) : Observable <ReservaEmpresa[]> {
        return this.http.get<ReservaEmpresa[]>(this.myAppUrl + this.myApiUrl + 'empresa-pas/' + id);
    }

    //Lista todas las reservas futuras de una empresa    
    getReservasFuturasEmpresa(id: number) : Observable <ReservaEmpresa[]> {
        return this.http.get<ReservaEmpresa[]>(this.myAppUrl + this.myApiUrl + 'empresa-fut/' + id);
    }
   
    //Agrega una reserva
    addReserva(body: { PK_Usuario: number; PK_Viaje: number }) : Observable<any> {
        return this.http.post<Reserva>(this.myAppUrl + this.myApiUrl, body);
    }

    //Cancela una reserva
    cancelarReserva(id: number) : Observable<any> {
        return this.http.put<Reserva>(this.myAppUrl + this.myApiUrl + id, null);
    }

}
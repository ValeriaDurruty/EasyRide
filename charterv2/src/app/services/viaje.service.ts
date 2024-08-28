
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Viaje } from "../interfaces/viaje.interface";
import { response } from "express";


@Injectable({
  providedIn: "root"
})
export class ViajeService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/viajes/';
    }

    getViajesXEmpresa(fkEmpresa: number): Observable<Viaje[]> {
      const url = `${this.myAppUrl}${this.myApiUrl}empresa/${fkEmpresa}`;
      console.log(`Request URL: ${url}`);
      return this.http.get<Viaje[]>(url);
    }

    getViajeXid(id: number): Observable<Viaje> {
      return this.http.get<Viaje>(`${this.myAppUrl}${this.myApiUrl}${id}`);
    }

    getViajes():Observable<Viaje[]>{
      return this.http.get<Viaje[]>(`${this.myAppUrl}${this.myApiUrl}`)
    }

    deleteViaje(id: number): Observable<void> {
      return this.http.delete<void>(this.myAppUrl + this.myApiUrl + id);
    }

    addViaje(viaje: Viaje): Observable<void> {
      return this.http.post<void>(this.myAppUrl + this.myApiUrl, viaje);
    }

    updateViaje(viajeId: number, viaje: Viaje): Observable<any> {
      return this.http.put(`${this.myAppUrl}${this.myApiUrl}${viajeId}`, viaje);
    }

    getBusquedaViajes(body: { fecha: string; origen: number; destino: number }): Observable<Viaje[]> {
      return this.http.post<Viaje[]>(`${this.myAppUrl}${this.myApiUrl}buscar`, body);
    }
}

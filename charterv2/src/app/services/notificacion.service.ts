import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root"
})
export class NotificacionService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/notificaciones/';
    }

    addNotificacion(FK_Usuario: number, FK_Viaje: number): Observable<void> {
      return this.http.post<void>(this.myAppUrl + this.myApiUrl, { FK_Viaje, FK_Usuario });
    }
};
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Modelo } from '../interfaces/modelo.interface';


@Injectable({
  providedIn: "root"
})
export class ModeloService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/modelos/';
    }

    getModelos() : Observable <Modelo[]> {
      return this.http.get<Modelo[]>(this.myAppUrl + this.myApiUrl);
    }

}
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Marca } from "../interfaces/marca.interface";


@Injectable({
  providedIn: "root"
})
export class MarcaService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/marcas/';
    }

    getMarcas() : Observable <Marca[]> {
      return this.http.get<Marca[]>(this.myAppUrl + this.myApiUrl);
    }

}
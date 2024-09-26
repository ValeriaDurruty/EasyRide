import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Empresa } from "../interfaces/empresa.interface";


@Injectable({
  providedIn: "root"
})
export class EmpresaService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/empresas/';
    }

    getEmpresas() : Observable <Empresa[]> {
      return this.http.get<Empresa[]>(this.myAppUrl + this.myApiUrl);
    }

    getEmpresa(id: number) : Observable <Empresa> {
      return this.http.get<Empresa>(this.myAppUrl + this.myApiUrl + id);
    }

    deleteEmpresa(id: number): Observable<void> {
      return this.http.delete<void>(this.myAppUrl + this.myApiUrl + id);
    }

    addEmpresa(empresa: Empresa): Observable<void> {
      return this.http.post<void>(this.myAppUrl + this.myApiUrl, empresa);
    }

    editEmpresa(id: number, empresa: Empresa): Observable<Empresa> {
      return this.http.put<Empresa>(this.myAppUrl + this.myApiUrl + id, empresa); 
    }

    checkCUIT(cuit: number): Observable<{ exists: boolean }> {
      return this.http.get<{ exists: boolean }>(this.myAppUrl + this.myApiUrl + 'checkcuit/' + cuit);;
    }


  private empresaIdSource = new BehaviorSubject<number | null>(null);
  empresaId$ = this.empresaIdSource.asObservable();

  setEmpresaId(id: number) {
    this.empresaIdSource.next(id);
  }

  getEmpresaId() {
    return this.empresaIdSource.value;
  }
}
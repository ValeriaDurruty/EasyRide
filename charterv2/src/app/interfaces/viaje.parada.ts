import { Parada } from "./parada.interface";

export interface ViajeParada {
    PK_Viaje_Parada?:number;
    orden:number;
    FK_Parada?: number;
    FK_Viaje: number;
    //LO VEMOS PORQ EN LA BASE NO ESTA
    parada?: string;
   
  }
import { Time } from "@angular/common";
import { Parada } from "./parada.interface";
import { ViajeParada } from "./viaje.parada";

export interface Viaje {
  PK_Viaje?: number;
  horario_salida: Time;
  horario_llegada: Time;
  cupo: number;
  precio: number;
  fecha_llegada: Date;
  fecha_salida: Date;
  FK_Charter: number;
  paradas?: ViajeParada[];
  patente?:string;
  empresa?:string;
  modelo?:string;
  marca?:string;
};
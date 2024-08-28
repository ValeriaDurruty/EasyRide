import { Time } from "@angular/common";

export interface Reserva {
    PK_Reserva?: number;
    fecha_creacion?: Date;
    FK_Estado_reserva?: number;
    estado_reserva?: string;
    FK_Usuario?: number;
    FK_Viaje?: number;
    nombre?: string;
    apellido?: string;
    empresa?:string;
    horario_salida?:Time;
  };
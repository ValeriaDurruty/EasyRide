
export interface Charter {
  PK_Charter?: number;
  patente: string;
  capacidad: number;
  anio: number;
  FK_Empresa: number;
  FK_Modelo: number;
  modelo?: string;
  marca?: string;
};
// Objetivo: Definir la interfaz para el objeto addUsuario.

export interface addUsuario {
    PK_Usuario?: number;
    nombre: string;
    apellido: string;
    nro_documento: number;
    email: string;
    contrasenia: string;
    FK_Rol?: number;
    FK_Empresa?: number;
};
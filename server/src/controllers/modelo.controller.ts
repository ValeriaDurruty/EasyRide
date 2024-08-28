import { Request, Response } from "express";
import connection from "../db/connection";


//Listar todos los modelos
export const getModelos = (req: Request, res: Response) => {
    
    connection.query('SELECT * FROM modelo;', (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar los modelos:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar los modelos' });
        } else {
            if (data.length === 0) {
                return res.json('No hay modelos cargados');
            } else {
                res.json(data);
            }
        }
    });
}
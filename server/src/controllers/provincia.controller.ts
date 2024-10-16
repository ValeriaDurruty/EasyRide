import { Request, Response } from "express";
import connection from "../db/connection";


//Listar todas las provincias
export const getProvincias = (req: Request, res: Response) => {
    
    connection.query('SELECT * FROM provincia ORDER BY nombre ASC;', (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar las provincias:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las provincias' });
        } else {
            if (data.length === 0) {
                return res.json('No hay provincias cargadas');
            } else {
                res.json(data);
            }
        }
    });
}
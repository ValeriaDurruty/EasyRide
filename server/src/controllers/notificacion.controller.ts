import { Request, Response } from "express";
import connection from "../db/connection";

// Activar notificación de disponibilidad de un viaje
export const postNotificacion = (req: Request, res: Response) => {
    const { FK_Viaje, FK_Usuario } = req.body;

    const query = `
        INSERT INTO notificacion (FK_Viaje, FK_Usuario, enviada) 
        VALUES (?, ?, 0);
    `;

    connection.query(query, [FK_Viaje, FK_Usuario], (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al activar notificación:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al activar notificación' });
        } else {
            res.json({ message: 'Notificación activada correctamente' });
        }
    });
}
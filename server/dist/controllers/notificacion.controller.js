"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNotificacion = void 0;
const connection_1 = __importDefault(require("../db/connection"));
// Activar notificación de disponibilidad de un viaje
const postNotificacion = (req, res) => {
    const { FK_Viaje, FK_Usuario } = req.body;
    const query = `
        INSERT INTO notificacion (FK_Viaje, FK_Usuario, enviada) 
        VALUES (?, ?, 0);
    `;
    connection_1.default.query(query, [FK_Viaje, FK_Usuario], (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al activar notificación:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al activar notificación' });
        }
        else {
            res.json({ message: 'Notificación activada correctamente' });
        }
    });
};
exports.postNotificacion = postNotificacion;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putParadas = exports.deleteParadas = exports.getParadasxId = exports.addParada = exports.getParadas = exports.getParadasxEmpresa = void 0;
const connection_1 = __importDefault(require("../db/connection"));
//Listar todos las paradas
const getParadasxEmpresa = (req, res) => {
    const { FK_Empresa } = req.params;
    connection_1.default.query('SELECT p.PK_Parada, p.nombre AS parada, p.coordenadas, l.PK_Localidad, l.nombre AS localidad, pr.PK_Provincia, pr.nombre AS provincia FROM Parada p INNER JOIN Localidad l ON p.FK_Localidad = l.PK_Localidad INNER JOIN Provincia pr ON l.FK_Provincia = pr.PK_Provincia WHERE p.FK_Empresa = ?;', FK_Empresa, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las paradas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las paradas' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay paradas cargadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getParadasxEmpresa = getParadasxEmpresa;
//Listar todos las paradas
const getParadas = (req, res) => {
    connection_1.default.query('SELECT p.PK_Parada, p.nombre AS parada, p.coordenadas, p.FK_Empresa, l.PK_Localidad, l.nombre AS localidad, pr.PK_Provincia, pr.nombre AS provincia FROM Parada p INNER JOIN Localidad l ON p.FK_Localidad = l.PK_Localidad INNER JOIN Provincia pr ON l.FK_Provincia = pr.PK_Provincia GROUP BY p.nombre, l.PK_Localidad, pr.PK_Provincia ORDER BY p.nombre;', (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las paradas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las paradas' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay paradas cargadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getParadas = getParadas;
const addParada = (req, res) => {
    const { nombre, coordenadas, FK_Empresa, FK_Localidad } = req.body;
    // Validamos que se hayan proporcionado todos los datos necesarios
    if (!nombre || !coordenadas || !FK_Empresa || !FK_Localidad) {
        return res.status(400).json({ error: 'Todos los campos son requeridos: nombre, coordenadas, FK_Empresa, FK_Localidad' });
    }
    // Consulta para insertar una nueva parada
    const query = `
        INSERT INTO Parada (nombre, coordenadas, FK_Empresa, FK_Localidad) 
        VALUES (?, ?, ?, ?)
    `;
    // Ejecutamos la consulta de inserción
    connection_1.default.query(query, [nombre, coordenadas, FK_Empresa, FK_Localidad], (err, result) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al insertar la nueva parada:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al insertar la nueva parada' });
        }
        else {
            // Devolver la información de la nueva parada insertada al cliente
            res.status(201).json({
                message: 'Parada creada exitosamente',
                paradaId: result.insertId,
                nombre,
                coordenadas,
                FK_Empresa,
                FK_Localidad
            });
        }
    });
};
exports.addParada = addParada;
//Trae una parada en particular mediante una id
const getParadasxId = (req, res) => {
    const { PK_Parada } = req.params;
    connection_1.default.query('SELECT p.PK_Parada, p.nombre AS parada, p.coordenadas, p.FK_Empresa, l.PK_Localidad, l.nombre AS localidad, pr.PK_Provincia, pr.nombre AS provincia FROM Parada p INNER JOIN Localidad l ON p.FK_Localidad = l.PK_Localidad INNER JOIN Provincia pr ON l.FK_Provincia = pr.PK_Provincia WHERE p.PK_Parada = ?;', PK_Parada, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al traer la parada:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al mostrar la parada' });
        }
        else {
            if (data.length === 0) {
                return res.status(404).json('No se ha encontrado la parada');
            }
            else {
                res.json(data[0]);
            }
        }
    });
};
exports.getParadasxId = getParadasxId;
// Elimina una parada en particular mediante un id
const deleteParadas = (req, res) => {
    const { PK_Parada } = req.params;
    // Primero, verificar si la parada está asociada a un viaje
    const checkQuery = 'SELECT * FROM Viaje_Parada WHERE FK_Parada = ?';
    connection_1.default.query(checkQuery, [PK_Parada], (err, data) => {
        if (err) {
            console.error('Error al verificar la asociación de la parada:', err);
            return res.status(500).json({ error: 'Error al verificar la asociación de la parada' });
        }
        if (data.length > 0) {
            // La parada está asociada a un viaje
            return res.status(400).json({ message: 'La parada no se puede borrar porque tiene viajes asociados' });
        }
        else {
            // Si no está asociada, proceder a la eliminación
            const deleteQuery = 'DELETE FROM Parada WHERE PK_Parada = ?';
            connection_1.default.query(deleteQuery, [PK_Parada], (err, result) => {
                if (err) {
                    console.error('Error al eliminar la parada:', err);
                    return res.status(500).json({ error: 'Error al eliminar la parada' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'La parada no existe' });
                }
                else {
                    res.json({ message: 'Parada eliminada exitosamente' });
                }
            });
        }
    });
};
exports.deleteParadas = deleteParadas;
// Modifica una parada en particular mediante un id
const putParadas = (req, res) => {
    const { PK_Parada } = req.params;
    const { nombre, coordenadas, FK_Empresa, FK_Localidad } = req.body;
    // Validamos que se hayan proporcionado todos los datos necesarios
    if (!nombre || !coordenadas || !FK_Empresa || !FK_Localidad) {
        return res.status(400).json({ error: 'Todos los campos son requeridos: nombre, coordenadas, FK_Empresa, FK_Localidad' });
    }
    // Consulta para actualizar la parada
    const updateQuery = `
        UPDATE Parada 
        SET nombre = ?, coordenadas = ?, FK_Empresa = ?, FK_Localidad = ?
        WHERE PK_Parada = ?
    `;
    // Ejecutamos la consulta de actualización
    connection_1.default.query(updateQuery, [nombre, coordenadas, FK_Empresa, FK_Localidad, PK_Parada], (err, result) => {
        if (err) {
            console.error('Error al actualizar la parada:', err);
            return res.status(500).json({ error: 'Error al actualizar la parada' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'La parada no existe' });
        }
        else {
            res.json({ message: 'Parada actualizada exitosamente' });
        }
    });
};
exports.putParadas = putParadas;

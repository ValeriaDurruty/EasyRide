"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalidadesXProvincia = exports.getLocalidades = void 0;
const connection_1 = __importDefault(require("../db/connection"));
//Listar todos las localidades
const getLocalidades = (req, res) => {
    connection_1.default.query('SELECT * FROM localidad ORDER BY nombre ASC;', (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las localidades:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las localidades' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay localidades cargadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getLocalidades = getLocalidades;
//Listar todos los modelos de una marca
const getLocalidadesXProvincia = (req, res) => {
    const { FK_Provincia } = req.params;
    connection_1.default.query('SELECT * FROM localidad WHERE localidad.FK_Provincia = ? ORDER BY nombre ASC;', FK_Provincia, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las localidades:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las localidades' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay localidades cargadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getLocalidadesXProvincia = getLocalidadesXProvincia;

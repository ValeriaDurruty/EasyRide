"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelosXMarca = exports.getModelos = void 0;
const connection_1 = __importDefault(require("../db/connection"));
//Listar todos los modelos
const getModelos = (req, res) => {
    connection_1.default.query('SELECT * FROM modelo ORDER BY nombre ASC;', (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar los modelos:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar los modelos' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay modelos cargados');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getModelos = getModelos;
//Listar todos los modelos de una marca
const getModelosXMarca = (req, res) => {
    const { FK_Marca } = req.params;
    connection_1.default.query('SELECT * FROM modelo WHERE modelo.FK_Marca = ? ORDER BY nombre ASC;', FK_Marca, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar los modelos:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar los modelos' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay modelos cargados para la marca seleccionada');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getModelosXMarca = getModelosXMarca;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarcas = void 0;
const connection_1 = __importDefault(require("../db/connection"));
//Listar todos las marcas
const getMarcas = (req, res) => {
    connection_1.default.query('SELECT * FROM marca ORDER BY nombre ASC;', (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las marcas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las marcas' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay marcas cargadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getMarcas = getMarcas;

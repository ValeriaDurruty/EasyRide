"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvincias = void 0;
const connection_1 = __importDefault(require("../db/connection"));
//Listar todas las provincias
const getProvincias = (req, res) => {
    connection_1.default.query('SELECT * FROM provincia;', (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las provincias:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las provincias' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay provincias cargadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getProvincias = getProvincias;

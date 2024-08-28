"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const viaje_controller_1 = require("../controllers/viaje.controller");
const router = (0, express_1.Router)();
// Ruta para listar todos los viajes de una empresa
router.get('/empresa/:FK_Empresa', viaje_controller_1.getViajesXEmpresa);
// Ruta para listar todos los viajes
router.get('/', viaje_controller_1.getViajes);
// Ruta para lista de búsqueda de viajes
router.post('/buscar', viaje_controller_1.getBusquedaViajes);
// Ruta para obtener un charter en particular mediante una id
router.get('/:id', viaje_controller_1.getViajesXid);
// Ruta para eliminar un charter en particular mediante una id
router.delete('/:id', viaje_controller_1.deleteViajes);
// Ruta para agregar un viaje
router.post('/', viaje_controller_1.addViaje);
// Ruta para modificar un viaje en particular mediante una id
router.put('/:id', viaje_controller_1.putViajes);
exports.default = router;

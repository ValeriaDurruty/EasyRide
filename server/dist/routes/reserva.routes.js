"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reserva_controller_1 = require("../controllers/reserva.controller");
const router = (0, express_1.Router)();
// Ruta para listar todas las reservas de un pasajero
router.get('/usuario/:PK_Usuario', reserva_controller_1.getReservasPasajero);
// Ruta para listar todas las reservas futuras de un pasajero
router.get('/usuario-fut/:PK_Usuario', reserva_controller_1.getReservasFuturasPasajero);
// Ruta para listar todas las reservas pasadas de un pasajero
router.get('/usuario-pas/:PK_Usuario', reserva_controller_1.getReservasPasadasPasajero);
// Ruta para listar todas las reservas de una empresa
router.get('/empresa/:PK_Empresa', reserva_controller_1.getReservasEmpresa);
// Ruta para listar todas las reservas futuras de una empresa
router.get('/empresa-fut/:PK_Empresa', reserva_controller_1.getReservasFuturasEmpresa);
// Ruta para listar todas las reservas pasadas de una empresa
router.get('/empresa-pas/:PK_Empresa', reserva_controller_1.getReservasPasadasEmpresa);
// Ruta para agregar una reseva
router.post('/', reserva_controller_1.addReserva);
// Ruta para cancelar una reserva
router.put('/:PK_Reserva', reserva_controller_1.cancelarReserva);
exports.default = router;

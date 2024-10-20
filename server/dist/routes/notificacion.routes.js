"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificacion_controller_1 = require("../controllers/notificacion.controller");
const router = (0, express_1.Router)();
// Ruta para agregar una notificación de disponibilidad de un viaje
router.post('/', notificacion_controller_1.postNotificacion);
exports.default = router;

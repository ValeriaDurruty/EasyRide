"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const localidad_controller_1 = require("../controllers/localidad.controller");
const router = (0, express_1.Router)();
// Ruta para listar todas las localidades
router.get('/', localidad_controller_1.getLocalidades);
// Ruta para listar todas las localidades de una provincia
router.get('/prov/:FK_Provincia', localidad_controller_1.getLocalidadesXProvincia);
exports.default = router;

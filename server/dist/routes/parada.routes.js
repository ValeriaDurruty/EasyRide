"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parada_controller_1 = require("../controllers/parada.controller");
const router = (0, express_1.Router)();
// Ruta para listar todas las paradas
router.get('/', parada_controller_1.geParadas);
exports.default = router;

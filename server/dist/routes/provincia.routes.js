"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provincia_controller_1 = require("../controllers/provincia.controller");
const router = (0, express_1.Router)();
// Ruta para listar todas las provincias
router.get('/', provincia_controller_1.getProvincias);
exports.default = router;

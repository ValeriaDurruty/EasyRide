"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marca_controller_1 = require("../controllers/marca.controller");
const router = (0, express_1.Router)();
// Ruta para listar todos los modelos
router.get('/', marca_controller_1.getMarcas);
exports.default = router;

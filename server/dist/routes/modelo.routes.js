"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const modelo_controller_1 = require("../controllers/modelo.controller");
const router = (0, express_1.Router)();
// Ruta para listar todos los modelos
router.get('/', modelo_controller_1.getModelos);
// Ruta para listar todos los charters de una empresa
router.get('/marca/:FK_Marca', modelo_controller_1.getModelosXMarca);
exports.default = router;

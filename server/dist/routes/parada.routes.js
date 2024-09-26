"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parada_controller_1 = require("../controllers/parada.controller");
const router = (0, express_1.Router)();
// Ruta para listar todas las paradas de una empresa
router.get('/empresa/:FK_Empresa', parada_controller_1.getParadasxEmpresa);
// Ruta para obtener una parada en particular mediante una id
router.get('/:PK_Parada', parada_controller_1.getParadasxId);
// Ruta para eliminar una parada en particular mediante una id
router.delete('/:PK_Parada', parada_controller_1.deleteParadas);
// Ruta para listar todas las paradas
router.get('/', parada_controller_1.getParadas);
// Ruta para agregar una nueva parada
router.post('/', parada_controller_1.addParada);
// Ruta para modificar una parada en particular mediante una id
router.put('/:PK_Parada', parada_controller_1.putParadas);
exports.default = router;

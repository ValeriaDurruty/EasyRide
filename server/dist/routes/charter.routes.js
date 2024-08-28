"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const charter_controller_1 = require("../controllers/charter.controller");
const router = (0, express_1.Router)();
// Ruta para listar todos los charters de una empresa
router.get('/empresa/:FK_Empresa', charter_controller_1.getChartersXEmpresa);
// Ruta para obtener un charter en particular mediante una id
router.get('/:id', charter_controller_1.getCharters);
// Ruta para obtener un charter en particular mediante una id
router.get('/:id', charter_controller_1.getCharter);
// Ruta para eliminar un charter en particular mediante una id
router.delete('/:id', charter_controller_1.deleteCharters);
// Ruta para agregar un charter
router.post('/', charter_controller_1.postCharters);
// Ruta para modificar un charter en particular mediante una id
router.put('/:id', charter_controller_1.putCharters);
// Ruta para verificar la patente. EL Q SALTA 404
router.get('/checkpatente/:patente', charter_controller_1.checkCharterPatente);
exports.default = router;

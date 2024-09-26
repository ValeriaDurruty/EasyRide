"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresa_controller_1 = require("../controllers/empresa.controller");
const router = (0, express_1.Router)();
// Ruta para listar todas las empresas
router.get('/', empresa_controller_1.getEmpresas);
// Ruta para obtener una empresa en particular mediante una id
router.get('/:id', empresa_controller_1.getEmpresasXid);
// Ruta para eliminar una empresa en particular mediante una id
router.delete('/:id', empresa_controller_1.deleteEmpresas);
// Ruta para agregar una empresa
router.post('/', empresa_controller_1.postEmpresas);
// Ruta para modificar una empresa en particular mediante una id
router.put('/:id', empresa_controller_1.putEmpresas);
// Ruta para verificar el CUIT de una empresa
router.get('/checkcuit/:cuit', empresa_controller_1.checkCuitEmpresa);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Ruta para obtener un usuario cuando se loguea mediante su correo electrónico
router.get('/email/:email', user_controller_1.getUsuarioPorEmail);
// Ruta para listar todos los usuarios
router.get('/', user_controller_1.getUsuarios);
// Ruta para obtener un usuario en particular mediante una id
router.get('/:id', user_controller_1.getUsuario);
// Ruta para eliminar un usuario en particular mediante una id
router.delete('/:id', user_controller_1.deleteUsuario);
// Ruta para agregar un usuario
router.post('/', user_controller_1.postUsuario);
// Ruta para modificar un usuario en particular mediante una id
router.put('/:id', user_controller_1.putUsuario);
// Ruta para validar un usuario en particular mediante una id
router.put('/validar/:id', user_controller_1.putValidarUsuario);
exports.default = router;

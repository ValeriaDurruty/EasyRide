import { Router } from 'express';
import { getUsuarioPorEmail, deleteUsuario, getUsuarios, getUsuario, postUsuario, putUsuario, putValidarUsuario } from '../controllers/user.controller';

const router = Router();

// Ruta para obtener un usuario cuando se loguea mediante su correo electrónico
router.get('/email/:email', getUsuarioPorEmail);

// Ruta para listar todos los usuarios
router.get('/', getUsuarios);

// Ruta para obtener un usuario en particular mediante una id
router.get('/:id', getUsuario);

// Ruta para eliminar un usuario en particular mediante una id
router.delete('/:id', deleteUsuario);

// Ruta para agregar un usuario
router.post('/', postUsuario);

// Ruta para modificar un usuario en particular mediante una id
router.put('/:id', putUsuario);

// Ruta para validar un usuario en particular mediante una id
router.put('/validar/:id', putValidarUsuario);


export default router;
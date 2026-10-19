
// routes/activosRoutes.js
const express = require('express');
const router = express.Router();

const ActivoController = require('../controllers/ActivoController');
const verificarToken = require('../middlewares/authMiddleware');

// Registrar un activo
router.post('/', verificarToken, ActivoController.crearActivo);

// Obtener todos los activos del usuario autenticado
router.get('/', verificarToken, ActivoController.obtenerActivos);

// Obtener un activo por ID
router.get('/:id', verificarToken, ActivoController.obtenerActivo);

// Eliminar un activo por ID
router.delete('/:id', verificarToken, ActivoController.eliminarActivo);

module.exports = router;

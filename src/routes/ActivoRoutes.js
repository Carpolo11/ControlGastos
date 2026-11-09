
// routes/activosRoutes.js
const express = require('express');
const router = express.Router();

const ActivoController = require('../controllers/ActivController');
const verificarToken = require('../middlewares/authMiddleware');

// Registrar un activo
router.post('/', verificarToken, ActivoController.registrarActivo);

// Obtener todos los activos del usuario autenticado
router.get('/', verificarToken, ActivoController.obtenerActivos);

// Obtener un activo por ID
router.get('/:id', verificarToken, ActivoController.obtenerActivoPorId);

router.put('/:id', verificarToken, ActivoController.actualizarActivo);


router.delete('/:id', verificarToken, ActivoController.eliminarActivo);

module.exports = router;

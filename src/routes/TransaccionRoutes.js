const express = require('express');
const router = express.Router();
const TransaccionController = require('../controllers/TransaccionController');
const verificarToken = require('../middlewares/authMiddleware');

// Crear transacción
router.post('/', verificarToken, TransaccionController.crearTransaccion);

// Obtener todas
router.get('/', verificarToken, TransaccionController.obtenerTransacciones);

// Obtener por familia
router.get('/familia/:id_familia', verificarToken, TransaccionController.obtenerTransaccionesPorFamilia);

// Editar
router.put('/:id', verificarToken, TransaccionController.editarTransaccion);

// Eliminar
router.delete('/:id', verificarToken, TransaccionController.eliminarTransaccion);

module.exports = router;

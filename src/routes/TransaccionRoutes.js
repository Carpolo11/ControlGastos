// routes/TransaccionRoutes.js
const express = require('express');
const router = express.Router();
const TransaccionController = require('../controllers/TransaccionController'); 

// Rutas de transacciones
router.post('/', TransaccionController.crearTransaccion);
router.get('/', TransaccionController.obtenerTransacciones);

module.exports = router;
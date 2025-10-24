// routes/ReporteRoutes.js
const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController'); 

// Rutas de reportes (solo GET)
router.get('/', ReporteController.obtenerReporteCompleto);
router.get('/categoria', ReporteController.obtenerResumenCategoria);
router.get('/miembro', ReporteController.obtenerResumenMiembro);
router.get('/balance', ReporteController.obtenerBalance);

module.exports = router;
const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController'); 
const ReporteController = require('../controllers/ReporteController');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas de reportes (solo GET)
router.get('/', ReporteController.obtenerReporteCompleto);
router.get('/categoria', ReporteController.obtenerResumenCategoria);
router.get('/miembro', ReporteController.obtenerResumenMiembro);
router.get('/balance', ReporteController.obtenerBalance);
// ✅ Ruta principal de reportes con filtros opcionales
router.get('/', verificarToken, ReporteController.obtenerReportes);

module.exports = router;
module.exports = router;
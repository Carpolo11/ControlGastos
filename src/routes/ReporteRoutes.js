const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController');
const verificarToken = require('../middlewares/authMiddleware');

// ✅ Ruta principal de reportes con filtros opcionales
router.get('/', verificarToken, ReporteController.obtenerReportes);

module.exports = router;

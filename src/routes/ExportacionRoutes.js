// routes/ExportacionRoutes.js
const express = require('express');
const router = express.Router();
const ExportacionController = require('../controllers/ExportacionController');
const verificarToken = require('../middlewares/authMiddleware');

// Ruta para exportar datos - Solo GET
router.get('/',verificarToken, ExportacionController.exportarDatos);

module.exports = router;
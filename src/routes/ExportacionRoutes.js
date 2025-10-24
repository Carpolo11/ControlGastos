// routes/ExportacionRoutes.js
const express = require('express');
const router = express.Router();
const ExportacionController = require('../controllers/ExportacionController');

// Ruta para exportar datos - Solo GET
router.get('/', ExportacionController.exportarDatos);

module.exports = router;
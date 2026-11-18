// routes/DashBoardRoutes.js
const express = require('express');
const router = express.Router();

const DashboardController = require('../controllers/DashboardController');
const verificarToken = require('../middlewares/authMiddleware');

// RF15: resumen del panel principal del usuario autenticado
router.get('/', verificarToken, DashboardController.obtenerResumen);

module.exports = router;
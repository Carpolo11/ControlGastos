const express = require('express');
const router = express.Router();
const FamiliaController = require('../controllers/FamiliaController'); 
const verificarToken = require('../middlewares/authMiddleware')

// Rutas de familia
router.post('/', verificarToken, FamiliaController.crearFamilia);
router.get('/', verificarToken,  FamiliaController.obtenerFamilias);


module.exports = router;

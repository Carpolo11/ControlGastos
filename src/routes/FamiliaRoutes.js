const express = require('express');
const router = express.Router();
const FamiliaController = require('../controllers/FamiliaController'); 

// Rutas de familia
router.post('/', FamiliaController.crearFamilia);
router.get('/', FamiliaController.obtenerFamilias);


module.exports = router;

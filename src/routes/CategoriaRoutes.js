const express = require('express');
const router = express.Router();
const CategoriasController = require('../controllers/CategoriasController'); 

//miembros
router.post('/', CategoriasController.crearCategoria);
router.get('/', CategoriasController.obtenerCategoria);

module.exports = router;
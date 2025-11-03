const express = require('express');
const router = express.Router();
const CategoriasController = require('../controllers/CategoriasController'); 
const verificarToken = require('../middlewares/authMiddleware');

//miembros
router.post('/', verificarToken, CategoriasController.crearCategoria);
router.get('/', verificarToken, CategoriasController.obtenerCategoria);

module.exports = router;
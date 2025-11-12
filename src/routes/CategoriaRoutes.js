const express = require('express');
const router = express.Router();
const CategoriasController = require('../controllers/CategoriasController'); 
const verificarToken = require('../middlewares/authMiddleware');

//categorias
router.post('/', verificarToken, CategoriasController.crearCategoria);
router.get('/', verificarToken, CategoriasController.obtenerCategoria);
router.delete("/:id", verificarToken, CategoriasController.eliminarCategoria);
router.put("/:id", verificarToken, CategoriasController.actualizarCategoria );

module.exports = router;
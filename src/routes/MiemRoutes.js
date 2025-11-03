const express = require('express');
const router = express.Router();
const MiembroController = require('../controllers/MiembroController'); 
const verificarToken = require('../middlewares/authMiddleware');

//miembros
router.post('/', verificarToken, MiembroController.crearMiembro);
router.get('/', verificarToken, MiembroController.obtenerMiembros);

module.exports = router;
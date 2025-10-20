const express = require('express');
const router = express.Router();
const MiembroController = require('../controllers/MiembroController'); 

//miembros
router.post('/', MiembroController.crearMiembro);
router.get('/', MiembroController.obtenerMiembros);

module.exports = router;
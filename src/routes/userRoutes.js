// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas de usuarios
router.post('/', userController.guardarUsuario);
router.get('/', userController.obtenerUsuarios);
router.post('/login', userController.loginUsuario);

// 🔒 Rutas protegidas (requieren token)
router.get('/', verificarToken, userController.obtenerUsuarios);

module.exports = router;

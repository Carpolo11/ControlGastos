// controllers/userController.js
const userModel = require('../models/userModel');

// Registrar usuario
async function guardarUsuario(req, res) {
  const { identificacion, nombre, email, password_hash } = req.body;

    // 👇 Agregamos este log para ver qué llega desde Vue
  console.log("📩 Datos recibidos del frontend:", req.body);

  try {
    const existeUsuario = await userModel.obtenerUsuarioPorCorreo(email);
    if (existeUsuario) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const nuevoUsuario = await userModel.insertarUsuario(identificacion, nombre, email, password_hash);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al guardar el usuario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Login
async function loginUsuario(req, res) {
  const { email, password_hash } = req.body;

  try {
    const usuario = await userModel.loginUsuario(email, password_hash);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Aquí puedes generar un token JWT si deseas manejar sesiones seguras
    res.status(200).json({ mensaje: 'Login exitoso', usuario });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Obtener todos
async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await userModel.obtenerUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}





module.exports = {
  guardarUsuario,
  obtenerUsuarios,
  loginUsuario
};

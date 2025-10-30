const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registrar usuario
async function guardarUsuario(req, res) {
  const { identificacion, nombre, email, password_hash, rol } = req.body;

  console.log("📩 Datos recibidos del frontend:", req.body);

  try {
    const existeUsuario = await userModel.obtenerUsuarioPorCorreo(email);
    if (existeUsuario) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña antes de guardar
    const passwordHash = await bcrypt.hash(password_hash, 10);

    const nuevoUsuario = await userModel.insertarUsuario(
      identificacion,
      nombre,
      email,
      passwordHash,
      rol
    );

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al guardar el usuario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Login
async function loginUsuario(req, res) {
  const { email, password } = req.body;

  try {
    // Buscar usuario por correo
    const usuario = await userModel.obtenerUsuarioPorCorreo(email);

    console.log("🧠 Usuario encontrado en DB:", usuario);

    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrecta' });
    }

    // Comparar contraseñas
    const coincide = await bcrypt.compare(password, usuario.password_hash);

    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // ✅ Datos que se incluirán en el token
    const payload = {
      id: usuario.id, // o identificacion
      email: usuario.email,
      rol: usuario.rol
    };

    // ✅ Generar el token
    const secretKey = process.env.JWT_SECRET || "clave_por_defecto";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    console.log("✅ Token generado:", token); // <-- Para verificar que sí se genera

    // Si todo está bien
    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario,
      token: token,
    });
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
  loginUsuario,
};

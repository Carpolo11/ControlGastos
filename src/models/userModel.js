// models/userModel.js
const db = require('../db');

// Buscar usuario por correo
async function obtenerUsuarioPorCorreo(email) {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0] || null;
}

// Insertar un nuevo usuario
async function insertarUsuario(identificacion, nombre, email, password_hash) {
  const query = 'INSERT INTO usuarios (identificacion, nombre, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [identificacion,nombre, email, password_hash];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Login de usuario
async function loginUsuario(email, password_hash) {
  const query = 'SELECT * FROM usuarios WHERE email = $1 AND password_hash = $2';
  const result = await db.query(query, [email, password_hash]);
  return result.rows[0] || null;
}


// Obtener todos los usuarios
async function obtenerUsuarios() {
  const query = 'SELECT * FROM usuarios';
  const result = await db.query(query);
  return result.rows;
}


module.exports = {
  obtenerUsuarioPorCorreo,
  insertarUsuario,
  obtenerUsuarios,
  loginUsuario
};

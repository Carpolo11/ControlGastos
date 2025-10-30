const db = require('../db');

// Buscar usuario por correo
async function obtenerUsuarioPorCorreo(email) {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0] || null;
}

// Insertar un nuevo usuario
async function insertarUsuario(identificacion, nombre, email, password_hash, rol) {
  const query = `
    INSERT INTO usuarios (identificacion, nombre, email, password_hash, rol)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  const values = [identificacion, nombre, email, password_hash, rol];
  const result = await db.query(query, values);
  return result.rows[0];
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
};
